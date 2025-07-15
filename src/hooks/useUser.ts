import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  loadUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from '../services/firebase/userService';
import { User } from '../models';

/** Hook: Ein einzelnes User-Objekt laden */
export function useUser(uid: string) {
  return useQuery<User, Error>({
    queryKey: ['user', uid],
    queryFn: () => loadUserProfile(uid),
    enabled: Boolean(uid),
  });
}

/** Hook: Neues User-Profil anlegen */
export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation<
    void,
    Error,
    { uid: string } & Omit<User, 'uid' | 'createdAt'>
  >({
    mutationFn: ({ uid, ...data }) => createUserProfile(uid, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['user', vars.uid] });
    },
  });
}

/** Hook: Bestehendes User-Profil updaten */
export function useUpdateUser(uid: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, Partial<Omit<User, 'uid'>>>(
    {
      mutationFn: data => updateUserProfile(uid, data),
      onSuccess: () => qc.invalidateQueries({ queryKey: ['user', uid] }),
    }
  );
}

/** Hook: User-Profil löschen */
export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: uid => deleteUserProfile(uid),
    onSuccess: (_, uid) => {
      qc.invalidateQueries({ queryKey: ['user', uid] });
    },
  });
}
