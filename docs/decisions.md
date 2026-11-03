# Décisions à prendre avec M. Ndiaye (avant le sprint 0)

Source : *Architecture technique V1*, §16. Cocher et dater chaque décision une fois prise.

- [ ] **Hébergement** : Allemagne pour le pilote (avec autorisation CDP de transfert) ou Sénégal dès le départ ?
- [ ] **Compte de paiement** : un compte PayDunya par commerçant (recommandé) ou un compte Kazimara unique ?
- [ ] **Seuil de lancement du vocal wolof** : quel taux de ventes justes après le test terrain (proposition : 85 %) ? Si non atteint : « bêta » ou report ?
- [ ] **Frais de paiement** : qui paie la commission PayDunya, le commerçant ou Kazimara ?
- [ ] **Validation comptable** : quel expert-comptable sénégalais valide les mentions de la facture et le livre de caisse ?

## Démarches longues à lancer dès le sprint 0

- [ ] Dossier CDP (loi 2008-12)
- [ ] Compte PayDunya Business
- [ ] Vérification Meta Business (WhatsApp Business Cloud API)
- [ ] Comptes Apple Developer et Google Play
- [ ] Réservation des domaines (`kazimara.sn`, `verifier.kazimara.sn`, `.com`)

## Choix d'implémentation déjà faits dans le code (modifiables)

- **Arrondi de la TVA** : total de ligne HT arrondi au franc, puis TVA calculée par taux sur la base HT cumulée, arrondie au franc (0,5 → supérieur). À faire confirmer par l'expert-comptable.
- **Quantités** : décimales autorisées (3 maximum) pour les ventes au kilo ou au litre.
- **Téléphone** : seuls les mobiles sénégalais (`70`, `75`, `76`, `77`, `78`) sont acceptés en V1.
