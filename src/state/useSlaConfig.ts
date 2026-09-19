import { useEffect, useState } from 'react';
import { DEFAULT_SLA_CONFIG, SlaConfig } from '../types';
import { subscribeSlaConfig } from '../services/slaConfig';
import { useAuth } from './AuthContext';

/** Falls back to the documented defaults (see handoff README) until the
 *  Firestore doc loads — there's no round-1 UI to edit it yet. */
export function useSlaConfig(): SlaConfig {
  const { user } = useAuth();
  const [config, setConfig] = useState<SlaConfig>(DEFAULT_SLA_CONFIG);

  useEffect(() => {
    if (!user) return;
    return subscribeSlaConfig(setConfig);
  }, [user]);

  return config;
}
