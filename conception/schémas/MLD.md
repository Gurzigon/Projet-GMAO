# MLD

- Utilisateur
( <b>CodeUtilisateur</b>, nom, prénom, email, mot de passe, <u>#CodeRôle</u>, <u>#Service.label</u>)

- Service
( <b>CodeService</b>, label)

- Rôle
( <b>CodeRôle</b>, label)

- Intervention
( <b>CodeIntervention</b>, titre, description, détails,société, commentaire, commentaire final, dates, photo, personne à prévenir <u>#CodeUtilisateur</u>, <u>#CodeLocalisation</u>, <u>#CodeStatus</u>, <u>#CodeCatégorie</u>, <u>#CodePriorité</u>,<u>#CodeType</u>)

- Mouvement ( <b>CodeMouvement</b>, entrée, sortie, date)

- Matériel
( <b>CodeMateriel</b>, nom, marque, modèle, année, quantité, immatriculation, numéro de série, numéro de moteur, date d'achat, temps d'utilisation, commentaire, photo, <u>#CodeCatégorie</u>, <u>#CodeStatus</u>, <u>#CodeLocalisation</u>, <u>#CodeType</u>, <u>#CodeDocumentation</u>, <u>#CodeParent</u>, <u>#CodeMouvement</u>)

- Documentation (<b>CodeDocumentation</b>, titre, type)

- Parent ( <b>CodeParent</b>, label)

- Préventif
( <b>CodePréventif</b>, titre, description, procédure,société,date)

- Status
( <b>CodeStatus</b>, label)

- Priorité
( <b>CodePriorité</b>, label)

- Localisation
( <b>CodeLocalisation</b>, label)

- Catégorie
( <b>CodeCatégorie</b>, label)

-  Type
( <b>CodeType</b>, label)

- <b>MATERIELPREVENTIF</b>
( <u>#CodeMatériel</u>, <u>#CodePréventif</u>)

- <b>MATERIELINTERVENTION</b>
( <u>#CodeMatériel</u>, <u>#CodeIntervention</u>)