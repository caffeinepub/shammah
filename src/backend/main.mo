import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Option "mo:core/Option";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import ExternalBlob "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";



actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type JournalEntry = {
    timestamp : Time.Time;
    content : Text;
  };

  public type MindfulnessActivity = {
    timestamp : Time.Time;
    activityType : Text;
    duration : Nat; // In minutes
  };

  public type QuizResponse = {
    questionId : Text;
    answer : Text;
  };

  public type WellnessPillar = {
    name : Text;
    progress : Nat; // Percentage (0-100)
  };

  public type Reward = {
    timestamp : Time.Time;
    rewardType : Text;
    description : Text;
    source : Text;
  };

  public type Badge = {
    name : Text;
    description : Text;
    pointsNeeded : Nat;
    achieved : Bool;
    achievedTimestamp : ?Time.Time;
    progress : Nat; // Track progress towards badge if it's in progress
  };

  public type WellnessMetrics = {
    physical : Nat;
    emotional : Nat;
    social : Nat;
    financial : Nat;
    leisure : Nat;
    personal : Nat;
    spiritual : Nat;
  };

  public type ProgressPhoto = {
    timestamp : Time.Time;
    photo : ExternalBlob.ExternalBlob;
    description : Text;
    isBaseline : Bool;
  };

  public type Resource = {
    id : Nat;
    title : Text;
    description : Text;
    resourceType : Text; // e.g. "Video", "eBook", etc.
    link : Text; // URL to resource
    resource : ExternalBlob.ExternalBlob;
  };

  public type MedicationRecord = {
    id : Nat;
    name : Text;
    dosage : Text;
    frequency : Text;
    timeOfDay : Text;
    startDate : Time.Time;
    endDate : ?Time.Time;
    adherenceLogs : [MedicationAdherence];
  };

  public type MedicationAdherence = {
    timestamp : Time.Time;
    taken : Bool;
    notes : Text;
  };

  public type DebtRecord = {
    id : Nat;
    creditorName : Text;
    amount : Nat;
    interestRate : Nat;
    dueDate : Time.Time;
    payments : [DebtPayment];
    status : DebtStatus;
  };

  public type DebtPayment = {
    paymentDate : Time.Time;
    amountPaid : Nat;
    remainingBalance : Nat;
  };

  public type DebtStatus = {
    #active;
    #paidOff;
    #overdue : Nat;
  };

  public type UserProfile = {
    id : Principal;
    email : Text;
    username : Text;
    skinHealthScore : Nat;
    usageDurationMonths : Nat;
    quizResponses : [QuizResponse];
    wellnessPillars : [WellnessPillar];
    journalEntries : [JournalEntry];
    mindfulnessActivities : [MindfulnessActivity];
    gamifiedScore : Nat;
    points : Nat;
    rewards : [Reward];
    badges : [Badge];
    wellnessMetrics : WellnessMetrics;
    progressPhotos : [ProgressPhoto];
    onboardingCompleted : Bool;
    medications : [MedicationRecord];
    debts : [DebtRecord];
  };

  module WellnessPillar {
    public func compare(pillar1 : WellnessPillar, pillar2 : WellnessPillar) : Order.Order {
      Text.compare(pillar1.name, pillar2.name);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let resources = Map.empty<Nat, Resource>();

  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userProfiles.values().toArray();
  };

  public query ({ caller }) func getAllUserWellnessPillars() : async [WellnessPillar] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all wellness pillars");
    };
    userProfiles.values().toArray().map(func(userProfile) { userProfile.wellnessPillars }).flatten().sort();
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    if (profile.id != caller) {
      Runtime.trap("Unauthorized: Cannot save profile for another user");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createUserProfile(
    email : Text,
    username : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    switch (userProfiles.get(caller)) {
      case (?_) { Runtime.trap("Profile for this user already exists") };
      case (null) {
        let newProfile : UserProfile = {
          id = caller;
          email;
          username;
          skinHealthScore = 0;
          usageDurationMonths = 0;
          quizResponses = [];
          wellnessPillars = [
            { name = "Physical Care"; progress = 0 },
            { name = "Emotional Resilience"; progress = 0 },
            { name = "Social Connection"; progress = 0 },
            { name = "Financial Health"; progress = 0 },
            { name = "Leisure & Fun"; progress = 0 },
            { name = "Personal Growth"; progress = 0 },
            { name = "Spiritual Meaning"; progress = 0 },
          ];
          journalEntries = [];
          mindfulnessActivities = [];
          gamifiedScore = 0;
          points = 0;
          rewards = [];
          badges = [
            {
              name = "Consistent Tracker";
              description = "Log activities daily for a week";
              pointsNeeded = 100;
              achieved = false;
              achievedTimestamp = null;
              progress = 0;
            },
            {
              name = "Milestone Achiever";
              description = "Complete all pillar tasks";
              pointsNeeded = 200;
              achieved = false;
              achievedTimestamp = null;
              progress = 0;
            },
            {
              name = "Wellness Champion";
              description = "Reach 95% in all pillars";
              pointsNeeded = 400;
              achieved = false;
              achievedTimestamp = null;
              progress = 0;
            },
            {
              name = "Reflection Guru";
              description = "Keep a regular journal for a month";
              pointsNeeded = 100;
              achieved = false;
              achievedTimestamp = null;
              progress = 0;
            },
            {
              name = "Ultimate Wellness Master";
              description = "Balance all areas for 6 months";
              pointsNeeded = 1200;
              achieved = false;
              achievedTimestamp = null;
              progress = 0;
            },
          ];
          wellnessMetrics = {
            physical = 0;
            emotional = 0;
            social = 0;
            financial = 0;
            leisure = 0;
            personal = 0;
            spiritual = 0;
          };
          progressPhotos = [];
          onboardingCompleted = false;
          medications = [];
          debts = [];
        };
        userProfiles.add(caller, newProfile);
      };
    };
  };

  public shared ({ caller }) func setUsageDuration(months : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set usage duration");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let updatedProfile = {
          profile with usageDurationMonths = months
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func saveQuizResponse(questionId : Text, answer : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save quiz responses");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let newResponse : QuizResponse = {
          questionId;
          answer;
        };
        let updatedResponses = profile.quizResponses.concat([newResponse]);
        let updatedProfile = {
          profile with quizResponses = updatedResponses
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func completeOnboarding() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete onboarding");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let updatedProfile = {
          profile with onboardingCompleted = true
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func uploadProgressPhoto(photo : ExternalBlob.ExternalBlob, description : Text, isBaseline : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload progress photos");
    };
    let newPhoto : ProgressPhoto = {
      timestamp = Time.now();
      photo;
      description;
      isBaseline;
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let updatedPhotos = profile.progressPhotos.concat([newPhoto]);
        let updatedProfile = {
          profile with progressPhotos = updatedPhotos
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getProgressPhotos() : async [ProgressPhoto] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view progress photos");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile.progressPhotos };
    };
  };

  public shared ({ caller }) func addJournalEntry(content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add journal entries");
    };
    let entry : JournalEntry = {
      timestamp = Time.now();
      content;
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let updatedEntries = profile.journalEntries.concat([entry]);
        let updatedProfile = {
          profile with journalEntries = updatedEntries
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func addMindfulnessActivity(activityType : Text, duration : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add mindfulness activities");
    };
    let activity : MindfulnessActivity = {
      timestamp = Time.now();
      activityType;
      duration;
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let updatedActivities = profile.mindfulnessActivities.concat([activity]);
        let updatedProfile = {
          profile with mindfulnessActivities = updatedActivities
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func updateWellnessPillar(pillarName : Text, progress : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update wellness pillars");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        var found = false;
        let updatedPillars = profile.wellnessPillars.map(
          func(pillar) {
            if (pillar.name == pillarName) {
              found := true;
              { pillar with progress };
            } else {
              pillar;
            };
          }
        );
        if (not found) { Runtime.trap("Pillar not found") };
        let updatedProfile = {
          profile with wellnessPillars = updatedPillars
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func manageRewards(
    category : Text,
    activityScore : Nat,
    reflectionScore : Nat,
    categoryScore : Nat,
    categoryDescription : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage rewards");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let totalPoints = profile.points + (categoryScore + activityScore + reflectionScore);

        let updatedBadges = profile.badges.map(
          func(badge) {
            if (not badge.achieved and totalPoints >= badge.pointsNeeded) {
              let progress = if (totalPoints >= badge.pointsNeeded) { 100 } else {
                (totalPoints * 100) / badge.pointsNeeded;
              };
              {
                badge with
                achieved = totalPoints >= badge.pointsNeeded;
                achievedTimestamp = ?Time.now();
                progress;
              };
            } else {
              badge;
            };
          }
        );

        let newReward : Reward = {
          timestamp = Time.now();
          rewardType = " points in " # category # " activities.";
          description = categoryDescription # "Activity: " # (activityScore + reflectionScore).toText() # ", Reflection: " # reflectionScore.toText() # ", Category Score: " # categoryScore.toText() # " points.";
          source = category;
        };

        let updatedMetrics = {
          profile.wellnessMetrics with
          physical = if (category == "Physical Care") { categoryScore } else {
            profile.wellnessMetrics.physical;
          };
          emotional = if (category == "Emotional Resilience") { categoryScore } else {
            profile.wellnessMetrics.emotional;
          };
          social = if (category == "Social Connection") { categoryScore } else {
            profile.wellnessMetrics.social;
          };
          financial = if (category == "Financial Health") { categoryScore } else {
            profile.wellnessMetrics.financial;
          };
          leisure = if (category == "Leisure & Fun") { categoryScore } else {
            profile.wellnessMetrics.leisure;
          };
          personal = if (category == "Personal Growth") { categoryScore } else {
            profile.wellnessMetrics.personal;
          };
          spiritual = if (category == "Spiritual Meaning") { categoryScore } else {
            profile.wellnessMetrics.spiritual;
          };
        };

        let updatedProfile = {
          profile with
          points = totalPoints;
          rewards = profile.rewards.concat([newReward]);
          badges = updatedBadges;
          wellnessMetrics = updatedMetrics;
        };

        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getUsageDuration() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view usage duration");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile.usageDurationMonths };
    };
  };

  public query ({ caller }) func getPoints() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view points");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile.points };
    };
  };

  public query ({ caller }) func getRewards() : async [Reward] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view rewards");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile.rewards };
    };
  };

  public query ({ caller }) func getBadges() : async [Badge] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view badges");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile.badges };
    };
  };

  public query ({ caller }) func getWellnessMetrics() : async WellnessMetrics {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wellness metrics");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile.wellnessMetrics };
    };
  };

  public query ({ caller }) func isOnboardingCompleted() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check onboarding status");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile.onboardingCompleted };
    };
  };

  public query ({ caller }) func getBaselinePhoto() : async ?ProgressPhoto {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view baseline photo");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        profile.progressPhotos.find(func(photo) { photo.isBaseline });
      };
    };
  };

  public query ({ caller }) func getFollowupPhoto() : async ?ProgressPhoto {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view followup photo");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        profile.progressPhotos.find(func(photo) { not photo.isBaseline });
      };
    };
  };

  // Resources page related functions

  public query ({ caller }) func getAllResources() : async [Resource] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view resources");
    };
    resources.values().toArray();
  };

  public query ({ caller }) func getResourceById(id : Nat) : async ?Resource {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view resources");
    };
    resources.get(id);
  };

  public shared ({ caller }) func addResource(
    title : Text,
    description : Text,
    resourceType : Text,
    link : Text,
    resource : ExternalBlob.ExternalBlob,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add resources");
    };
    let newId = resources.size() + 1;
    let newResource : Resource = {
      id = newId;
      title;
      description;
      resourceType;
      link;
      resource;
    };
    resources.add(newId, newResource);
    newId;
  };

  public shared ({ caller }) func updateResource(
    id : Nat,
    title : Text,
    description : Text,
    resourceType : Text,
    link : Text,
    resource : ExternalBlob.ExternalBlob,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update resources");
    };
    switch (resources.get(id)) {
      case (null) { Runtime.trap("Resource not found") };
      case (?_) {
        let updatedResource : Resource = {
          id;
          title;
          description;
          resourceType;
          link;
          resource;
        };
        resources.add(id, updatedResource);
      };
    };
  };

  public shared ({ caller }) func deleteResource(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete resources");
    };
    switch (resources.get(id)) {
      case (null) { Runtime.trap("Resource not found") };
      case (?_) { resources.remove(id) };
    };
  };

  public query ({ caller }) func getResourcesByType(resourceType : Text) : async [Resource] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view resources");
    };
    resources.values().toArray().filter(func(resource) { resource.resourceType == resourceType });
  };

  public query ({ caller }) func searchResources(searchTerm : Text) : async [Resource] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view resources");
    };
    resources.values().toArray().filter(
      func(resource) {
        resource.title.contains(#text searchTerm) or resource.description.contains(#text searchTerm)
      }
    );
  };

  // Medication Management Functions

  public shared ({ caller }) func addMedication(
    name : Text,
    dosage : Text,
    frequency : Text,
    timeOfDay : Text,
    startDate : Time.Time,
    endDate : ?Time.Time,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage medications");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let newId = profile.medications.size() + 1;
        let newMedication : MedicationRecord = {
          id = newId;
          name;
          dosage;
          frequency;
          timeOfDay;
          startDate;
          endDate;
          adherenceLogs = [];
        };
        let updatedMedications = profile.medications.concat([newMedication]);
        let updatedProfile = {
          profile with medications = updatedMedications
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func updateMedication(
    medicationId : Nat,
    name : Text,
    dosage : Text,
    frequency : Text,
    timeOfDay : Text,
    startDate : Time.Time,
    endDate : ?Time.Time,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage medications");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let updatedMedications = profile.medications.map(
          func(medication) {
            if (medication.id == medicationId) {
              {
                medication with
                name;
                dosage;
                frequency;
                timeOfDay;
                startDate;
                endDate;
              };
            } else {
              medication;
            };
          }
        );
        let updatedProfile = {
          profile with medications = updatedMedications
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func deleteMedication(medicationId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage medications");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let updatedMedications = profile.medications.filter(func(m) { m.id != medicationId });
        let updatedProfile = {
          profile with medications = updatedMedications
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getMedications() : async [MedicationRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view medications");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile.medications };
    };
  };

  public shared ({ caller }) func logMedicationAdherence(medicationId : Nat, taken : Bool, notes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage medications");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let updatedMedications = profile.medications.map(
          func(medication) {
            if (medication.id == medicationId) {
              let newAdherence : MedicationAdherence = {
                timestamp = Time.now();
                taken;
                notes;
              };
              let updatedLogs = medication.adherenceLogs.concat([newAdherence]);
              {
                medication with adherenceLogs = updatedLogs
              };
            } else {
              medication;
            };
          }
        );
        let updatedProfile = {
          profile with medications = updatedMedications
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  // Debt Management Functions

  public shared ({ caller }) func addDebt(
    creditorName : Text,
    amount : Nat,
    interestRate : Nat,
    dueDate : Time.Time,
    payments : [DebtPayment],
    status : DebtStatus,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage debts");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let newId = profile.debts.size() + 1;
        let newDebt : DebtRecord = {
          id = newId;
          creditorName;
          amount;
          interestRate;
          dueDate;
          payments;
          status;
        };
        let updatedDebts = profile.debts.concat([newDebt]);
        let updatedProfile = {
          profile with debts = updatedDebts
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func updateDebt(
    debtId : Nat,
    creditorName : Text,
    amount : Nat,
    interestRate : Nat,
    dueDate : Time.Time,
    payments : [DebtPayment],
    status : DebtStatus,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage debts");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let updatedDebts = profile.debts.map(
          func(debt) {
            if (debt.id == debtId) {
              {
                debt with
                creditorName;
                amount;
                interestRate;
                dueDate;
                payments;
                status;
              };
            } else {
              debt;
            };
          }
        );
        let updatedProfile = {
          profile with debts = updatedDebts
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func deleteDebt(debtId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage debts");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let updatedDebts = profile.debts.filter(func(d) { d.id != debtId });
        let updatedProfile = {
          profile with debts = updatedDebts
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getDebts() : async [DebtRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view debts");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile.debts };
    };
  };

  public shared ({ caller }) func addDebtPayment(debtId : Nat, payment : DebtPayment) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage debts");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let updatedDebts = profile.debts.map(
          func(debt) {
            if (debt.id == debtId) {
              let updatedPayments = debt.payments.concat([payment]);
              {
                debt with payments = updatedPayments
              };
            } else {
              debt;
            };
          }
        );
        let updatedProfile = {
          profile with debts = updatedDebts
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func updateDebtStatus(debtId : Nat, newStatus : DebtStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage debts");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let updatedDebts = profile.debts.map(
          func(debt) {
            if (debt.id == debtId) {
              { debt with status = newStatus };
            } else {
              debt;
            };
          }
        );
        let updatedProfile = {
          profile with debts = updatedDebts
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };
};
