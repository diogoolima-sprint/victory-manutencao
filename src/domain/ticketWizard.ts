import { Role, Sector } from '../types';

export type WizardStep =
  | 'hotel'
  | 'sector'
  | 'room'
  | 'local'
  | 'category'
  | 'description'
  | 'priority'
  | 'photo'
  | 'summary';

/**
 * Step order for the new-ticket wizard. Admins pick a hotel first (they
 * aren't scoped to one); everyone else starts at sector. Picking the
 * "UHs" sector swaps the free-text "local" step for a room-number picker
 * — ported from getDraftSteps() in the prototype.
 */
export function getWizardSteps(role: Role | undefined, selectedSector: Sector | undefined): WizardStep[] {
  const steps: WizardStep[] = [];
  if (role === 'admin') steps.push('hotel');
  steps.push('sector');
  steps.push(selectedSector?.name === 'UHs' ? 'room' : 'local');
  steps.push('category', 'description', 'priority', 'photo', 'summary');
  return steps;
}
