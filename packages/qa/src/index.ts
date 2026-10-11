/* @auraglass/qa (private, QUAL). Certification internals; consumed by certification/**, scripts/{qual,storybook}/**
   and, through REQ-FIN-08, by tests/helpers/index.ts. */
export {
  resolveSubject, resolveSubjectName, filterSubjects, fetchSubjectIndex, parseSubjectIndex, loadSubjectUniverse,
  verifyManifestAgainstIndex, SubjectResolutionError, CROSS_CHECKED_KINDS,
  type SubjectEntry, type SubjectOwner, type SubjectUniverse, type ResolvedSubject, type StorybookIndex, type StorybookIndexEntry,
} from './resolve/resolveSubject.ts';
export { buildCertManifest, CertManifestError, CERT_MANIFEST_BASELINE, type CertManifestResult } from './resolve/certManifest.ts';
export { loadComponentMetas, type MetaRecord } from './resolve/componentMetas.ts';
export { buildInventory, collectInventory, UnclassifiedExportError, type Inventory, type InventoryItem, type ExportClass } from './inventory/buildInventory.ts';
export { checkSourceInventory, INVENTORY_BASELINE } from './inventory/inventoryGate.ts';
export { dhash, hamming, type RgbaImage } from './pixel/dhash.ts';
export { checkDistinctness, comparePair, DISTINCTNESS, type Capture, type DistinctnessReport } from './pixel/duplicates.ts';
export { scanTrackedPaths, gitTrackedPaths, readOd19, EVIDENCE_DIRS, COMMITTED_EVIDENCE_BASELINE } from './evidence/committedEvidence.ts';
export { checkBaseline, baselineFailures, readBaseline, type BaselineRow } from './evidence/expiringBaseline.ts';
export { loadOwnerOf } from './evidence/ownership.ts';
