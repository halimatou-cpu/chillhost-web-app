export interface Report {
  id: string;
  adId: string;
  reporterId: string;
  reporterInfo: {
    id: string;
    fullname: string;
    email: string;
    profilePicture?: string;
  };
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

export enum ReportReason {
  INAPPROPRIATE = "inappropriate", // Contenu inapproprié
  SCAM = "scam", // Arnaque
  FAKE = "fake", // Fausse annonce
  DUPLICATE = "duplicate", // Annonce en double
  UNAVAILABLE = "unavailable", // Logement non disponible
  INCORRECT_INFO = "incorrect_info", // Informations incorrectes
  OTHER = "other", // Autre
}

export enum ReportStatus {
  PENDING = "pending", // En attente
  RESOLVED = "resolved", // Résolu
  DISMISSED = "dismissed", // Rejeté
}
