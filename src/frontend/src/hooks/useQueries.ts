import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Badge, Reward, WellnessMetrics, ProgressPhoto, MedicationRecord, DebtRecord, DebtPayment, DebtStatus } from '../backend';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

// Get caller's user profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

// Check if onboarding is completed
export function useIsOnboardingCompleted() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['onboardingCompleted'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isOnboardingCompleted();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Create user profile
export function useCreateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, username }: { email: string; username: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createUserProfile(email, username);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create profile');
    },
  });
}

// Upload progress photo
export function useUploadProgressPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ photo, description, isBaseline }: { photo: ExternalBlob; description: string; isBaseline: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadProgressPhoto(photo, description, isBaseline);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['progressPhotos'] });
      toast.success('Photo uploaded successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload photo');
    },
  });
}

// Get progress photos
export function useGetProgressPhotos() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProgressPhoto[]>({
    queryKey: ['progressPhotos'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProgressPhotos();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Complete onboarding
export function useCompleteOnboarding() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeOnboarding();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['onboardingCompleted'] });
      toast.success('Welcome to SHAMMAH!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to complete onboarding');
    },
  });
}

// Save quiz response
export function useSaveQuizResponse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questionId, answer }: { questionId: string; answer: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveQuizResponse(questionId, answer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save quiz response');
    },
  });
}

// Add journal entry
export function useAddJournalEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addJournalEntry(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Journal entry saved!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save journal entry');
    },
  });
}

// Add mindfulness activity
export function useAddMindfulnessActivity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ activityType, duration }: { activityType: string; duration: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMindfulnessActivity(activityType, BigInt(duration));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Mindfulness activity logged!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to log mindfulness activity');
    },
  });
}

// Update wellness pillar progress
export function useUpdateWellnessPillar() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pillarName, progress }: { pillarName: string; progress: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateWellnessPillar(pillarName, BigInt(progress));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Progress updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update progress');
    },
  });
}

// Manage rewards
export function useManageRewards() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      category,
      activityScore,
      reflectionScore,
      categoryScore,
      categoryDescription,
    }: {
      category: string;
      activityScore: number;
      reflectionScore: number;
      categoryScore: number;
      categoryDescription: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.manageRewards(
        category,
        BigInt(activityScore),
        BigInt(reflectionScore),
        BigInt(categoryScore),
        categoryDescription
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Points earned! 🎉');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to manage rewards');
    },
  });
}

// Get points
export function useGetPoints() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['points'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPoints();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Get rewards
export function useGetRewards() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Reward[]>({
    queryKey: ['rewards'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRewards();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Get badges
export function useGetBadges() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Badge[]>({
    queryKey: ['badges'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBadges();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Get wellness metrics
export function useGetWellnessMetrics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WellnessMetrics>({
    queryKey: ['wellnessMetrics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWellnessMetrics();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Medication Management Hooks

export function useGetMedications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MedicationRecord[]>({
    queryKey: ['medications'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMedications();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddMedication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      dosage,
      frequency,
      timeOfDay,
      startDate,
      endDate,
    }: {
      name: string;
      dosage: string;
      frequency: string;
      timeOfDay: string;
      startDate: bigint;
      endDate: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMedication(name, dosage, frequency, timeOfDay, startDate, endDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Medication added successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add medication');
    },
  });
}

export function useUpdateMedication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      medicationId,
      name,
      dosage,
      frequency,
      timeOfDay,
      startDate,
      endDate,
    }: {
      medicationId: bigint;
      name: string;
      dosage: string;
      frequency: string;
      timeOfDay: string;
      startDate: bigint;
      endDate: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMedication(medicationId, name, dosage, frequency, timeOfDay, startDate, endDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Medication updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update medication');
    },
  });
}

export function useDeleteMedication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (medicationId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMedication(medicationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Medication deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete medication');
    },
  });
}

export function useLogMedicationAdherence() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      medicationId,
      taken,
      notes,
    }: {
      medicationId: bigint;
      taken: boolean;
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logMedicationAdherence(medicationId, taken, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Adherence logged!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to log adherence');
    },
  });
}

// Debt Management Hooks

export function useGetDebts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DebtRecord[]>({
    queryKey: ['debts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDebts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddDebt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      creditorName,
      amount,
      interestRate,
      dueDate,
      payments,
      status,
    }: {
      creditorName: string;
      amount: bigint;
      interestRate: bigint;
      dueDate: bigint;
      payments: DebtPayment[];
      status: DebtStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDebt(creditorName, amount, interestRate, dueDate, payments, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Debt added successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add debt');
    },
  });
}

export function useUpdateDebt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      debtId,
      creditorName,
      amount,
      interestRate,
      dueDate,
      payments,
      status,
    }: {
      debtId: bigint;
      creditorName: string;
      amount: bigint;
      interestRate: bigint;
      dueDate: bigint;
      payments: DebtPayment[];
      status: DebtStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDebt(debtId, creditorName, amount, interestRate, dueDate, payments, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Debt updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update debt');
    },
  });
}

export function useDeleteDebt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (debtId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteDebt(debtId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Debt deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete debt');
    },
  });
}

export function useAddDebtPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      debtId,
      payment,
    }: {
      debtId: bigint;
      payment: DebtPayment;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDebtPayment(debtId, payment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Payment recorded!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to record payment');
    },
  });
}
