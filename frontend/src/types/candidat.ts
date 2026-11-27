export interface Candidat {
    id: number;
    nom_prenoms: string;
    telephone: string;
    email: string;
    poste_recherche: string;
    niveau_etudes: string;
    statut: string;
    date_candidature?: string;  // optionnel — peut être absent selon l'enregistrement
    created_at?: string;        // optionnel — date de création technique
}