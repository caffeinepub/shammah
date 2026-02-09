import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface WellnessMetrics {
    social: bigint;
    spiritual: bigint;
    personal: bigint;
    leisure: bigint;
    emotional: bigint;
    financial: bigint;
    physical: bigint;
}
export interface MedicationAdherence {
    taken: boolean;
    notes: string;
    timestamp: Time;
}
export type Time = bigint;
export interface Reward {
    source: string;
    description: string;
    rewardType: string;
    timestamp: Time;
}
export interface MindfulnessActivity {
    duration: bigint;
    activityType: string;
    timestamp: Time;
}
export interface DebtRecord {
    id: bigint;
    status: DebtStatus;
    payments: Array<DebtPayment>;
    dueDate: Time;
    interestRate: bigint;
    creditorName: string;
    amount: bigint;
}
export interface MedicationRecord {
    id: bigint;
    endDate?: Time;
    dosage: string;
    name: string;
    adherenceLogs: Array<MedicationAdherence>;
    frequency: string;
    timeOfDay: string;
    startDate: Time;
}
export type DebtStatus = {
    __kind__: "active";
    active: null;
} | {
    __kind__: "overdue";
    overdue: bigint;
} | {
    __kind__: "paidOff";
    paidOff: null;
};
export interface QuizResponse {
    answer: string;
    questionId: string;
}
export interface DebtPayment {
    amountPaid: bigint;
    remainingBalance: bigint;
    paymentDate: Time;
}
export interface Badge {
    achieved: boolean;
    achievedTimestamp?: Time;
    name: string;
    pointsNeeded: bigint;
    description: string;
    progress: bigint;
}
export interface WellnessPillar {
    name: string;
    progress: bigint;
}
export interface JournalEntry {
    content: string;
    timestamp: Time;
}
export interface Resource {
    id: bigint;
    title: string;
    resource: ExternalBlob;
    link: string;
    description: string;
    resourceType: string;
}
export interface ProgressPhoto {
    description: string;
    isBaseline: boolean;
    timestamp: Time;
    photo: ExternalBlob;
}
export interface UserProfile {
    id: Principal;
    usageDurationMonths: bigint;
    quizResponses: Array<QuizResponse>;
    username: string;
    journalEntries: Array<JournalEntry>;
    badges: Array<Badge>;
    wellnessPillars: Array<WellnessPillar>;
    email: string;
    mindfulnessActivities: Array<MindfulnessActivity>;
    medications: Array<MedicationRecord>;
    onboardingCompleted: boolean;
    gamifiedScore: bigint;
    rewards: Array<Reward>;
    skinHealthScore: bigint;
    debts: Array<DebtRecord>;
    wellnessMetrics: WellnessMetrics;
    points: bigint;
    progressPhotos: Array<ProgressPhoto>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDebt(creditorName: string, amount: bigint, interestRate: bigint, dueDate: Time, payments: Array<DebtPayment>, status: DebtStatus): Promise<void>;
    addDebtPayment(debtId: bigint, payment: DebtPayment): Promise<void>;
    addJournalEntry(content: string): Promise<void>;
    addMedication(name: string, dosage: string, frequency: string, timeOfDay: string, startDate: Time, endDate: Time | null): Promise<void>;
    addMindfulnessActivity(activityType: string, duration: bigint): Promise<void>;
    addResource(title: string, description: string, resourceType: string, link: string, resource: ExternalBlob): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeOnboarding(): Promise<void>;
    createUserProfile(email: string, username: string): Promise<void>;
    deleteDebt(debtId: bigint): Promise<void>;
    deleteMedication(medicationId: bigint): Promise<void>;
    deleteResource(id: bigint): Promise<void>;
    getAllResources(): Promise<Array<Resource>>;
    getAllUserWellnessPillars(): Promise<Array<WellnessPillar>>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getBadges(): Promise<Array<Badge>>;
    getBaselinePhoto(): Promise<ProgressPhoto | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDebts(): Promise<Array<DebtRecord>>;
    getFollowupPhoto(): Promise<ProgressPhoto | null>;
    getMedications(): Promise<Array<MedicationRecord>>;
    getPoints(): Promise<bigint>;
    getProgressPhotos(): Promise<Array<ProgressPhoto>>;
    getResourceById(id: bigint): Promise<Resource | null>;
    getResourcesByType(resourceType: string): Promise<Array<Resource>>;
    getRewards(): Promise<Array<Reward>>;
    getUsageDuration(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWellnessMetrics(): Promise<WellnessMetrics>;
    isCallerAdmin(): Promise<boolean>;
    isOnboardingCompleted(): Promise<boolean>;
    logMedicationAdherence(medicationId: bigint, taken: boolean, notes: string): Promise<void>;
    manageRewards(category: string, activityScore: bigint, reflectionScore: bigint, categoryScore: bigint, categoryDescription: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveQuizResponse(questionId: string, answer: string): Promise<void>;
    searchResources(searchTerm: string): Promise<Array<Resource>>;
    setUsageDuration(months: bigint): Promise<void>;
    updateDebt(debtId: bigint, creditorName: string, amount: bigint, interestRate: bigint, dueDate: Time, payments: Array<DebtPayment>, status: DebtStatus): Promise<void>;
    updateDebtStatus(debtId: bigint, newStatus: DebtStatus): Promise<void>;
    updateMedication(medicationId: bigint, name: string, dosage: string, frequency: string, timeOfDay: string, startDate: Time, endDate: Time | null): Promise<void>;
    updateResource(id: bigint, title: string, description: string, resourceType: string, link: string, resource: ExternalBlob): Promise<void>;
    updateWellnessPillar(pillarName: string, progress: bigint): Promise<void>;
    uploadProgressPhoto(photo: ExternalBlob, description: string, isBaseline: boolean): Promise<void>;
}
