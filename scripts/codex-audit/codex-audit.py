"""Codex link audit. Reads the JSON dumps produced by dump-data.mjs and reports every way a node can be mis-linked.
usage: node scripts/codex-audit/dump-data.mjs && python3 -I scripts/codex-audit/codex-audit.py [--json report.json]
"""
import json, re, sys, collections
import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.out')
nodes = json.load(open(f'{OUT}/termTree.json'))
tl = json.load(open(f'{OUT}/timeline.json'))
tl_ids = {i['id'] for i in tl['items']}
map_ids = set(json.load(open(f'{OUT}/mapIds.json')))
layers = set(json.load(open(f'{OUT}/layers.json')))

ids = [n['id'] for n in nodes]
idset = set(ids)
by_id = {}
for n in nodes: by_id.setdefault(n['id'], n)
children = collections.defaultdict(list)
for n in nodes:
    if n.get('parentId'): children[n['parentId']].append(n['id'])
    for p in n.get('secondaryParentIds') or []: children[p].append(n['id'])
incoming = collections.defaultdict(set)
for n in nodes:
    for r in n.get('relatedIds') or []: incoming[r].add(n['id'])

R = {}
R['duplicate_ids'] = sorted(i for i, c in collections.Counter(ids).items() if c > 1)
R['dangling_parent'] = [(n['id'], n['parentId']) for n in nodes if n.get('parentId') and n['parentId'] not in idset]
R['dangling_secondary_parent'] = [(n['id'], p) for n in nodes for p in (n.get('secondaryParentIds') or []) if p not in idset]
R['dangling_related'] = [(n['id'], r) for n in nodes for r in (n.get('relatedIds') or []) if r not in idset]
R['self_related'] = [n['id'] for n in nodes if n['id'] in (n.get('relatedIds') or [])]
R['duplicate_related_entries'] = [n['id'] for n in nodes if len(n.get('relatedIds') or []) != len(set(n.get('relatedIds') or []))]
R['related_is_parent'] = [n['id'] for n in nodes if n.get('parentId') in (n.get('relatedIds') or [])]
R['bad_layer'] = sorted({n['layer'] for n in nodes if n.get('layer') and n['layer'] not in layers})
R['bad_layer_nodes'] = [(n['id'], n['layer']) for n in nodes if n.get('layer') and n['layer'] not in layers]
R['dangling_timeline'] = [(n['id'], n['timelineId']) for n in nodes if n.get('timelineId') and n['timelineId'] not in tl_ids]
R['dangling_map_feature'] = [(n['id'], n['mapFeatureId']) for n in nodes if n.get('mapFeatureId') and n['mapFeatureId'] not in map_ids and n['mapFeatureId'] not in tl_ids]
R['orphans_no_parent'] = [n['id'] for n in nodes if not n.get('parentId') and not n.get('secondaryParentIds')]
R['no_image'] = [n['id'] for n in nodes if not n.get('images')]
R['no_description'] = [n['id'] for n in nodes if not (n.get('description') or '').strip()]
# cycles in the parent chain
cyc = []
for n in nodes:
    seen = set(); cur = n['id']
    while cur and cur in by_id and by_id[cur].get('parentId'):
        if cur in seen: cyc.append(n['id']); break
        seen.add(cur); cur = by_id[cur]['parentId']
R['parent_cycles'] = sorted(set(cyc))
# isolation: leaf with no related, nobody relates to it, no map/timeline link
R['isolated_leaves'] = [n['id'] for n in nodes if not children.get(n['id']) and not (n.get('relatedIds')) and not incoming.get(n['id']) and not n.get('mapFeatureId') and not n.get('timelineId')]
# non-reciprocal related links
nonrecip = []
for n in nodes:
    for r in n.get('relatedIds') or []:
        t = by_id.get(r)
        if t and n['id'] not in (t.get('relatedIds') or []) and t.get('parentId') != n['id'] and n.get('parentId') != r:
            nonrecip.append((n['id'], r))
R['non_reciprocal_related'] = nonrecip
# name-mention candidates: description mentions another node's distinctive name but no link exists
name_index = {}
for n in nodes:
    nm = re.sub(r'\s*\(.*?\)\s*', ' ', n['name']).strip()
    if len(nm) >= 10 and ' ' in nm and len(nm.split()) <= 5: name_index.setdefault(nm.lower(), n['id'])
cands = []
for n in nodes:
    d = (n.get('description') or '').lower()
    linked = set(n.get('relatedIds') or []) | {n.get('parentId')} | set(children.get(n['id'], [])) | set(n.get('secondaryParentIds') or [])
    for nm, tid in name_index.items():
        if tid != n['id'] and tid not in linked and nm in d: cands.append((n['id'], tid))
R['mention_candidates'] = cands

summary = {k: (len(v) if isinstance(v, list) else v) for k, v in R.items()}
print(json.dumps(summary, indent=1))
for k in ['duplicate_ids', 'dangling_parent', 'dangling_secondary_parent', 'self_related', 'related_is_parent', 'bad_layer', 'dangling_timeline', 'parent_cycles']:
    if R[k]: print(k, R[k][:40])
print('dangling_related sample', R['dangling_related'][:40])
print('dangling_map_feature sample', R['dangling_map_feature'][:30])
print('orphans sample', R['orphans_no_parent'][:30])
print('isolated sample', R['isolated_leaves'][:30])
if '--json' in sys.argv: json.dump(R, open(sys.argv[sys.argv.index('--json') + 1], 'w'), indent=1)
