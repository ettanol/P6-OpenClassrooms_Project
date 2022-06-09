# P6-OpenClassrooms_Project

L'API permet la **création** d'un compte, ainsi que le **partage** et l'ajout de **like** ou de **dislikes** pour différentes **sauces piquantes**.
Chaque utilisateur peut mettre en ligne une sauce, et les différents utilisateurs pourront ajouter leur avis sur la sauce en question. Les sauces sont définies par leur nom, l'entreprise les ayant crée, une description, le piment principal ainsi que la chaleur transmise. Une image peut être ajoutée.

## Ressources
User
Sauce


## Routes
  - Routes utilisateur
    - POST: /api/auth/signup => hach le mot de passe, et ajoute l'utilisateur à la base de donnée
    - POST : /api/auth/login => vérifie les informations d'identification, 
                            renvoie l'id de l'utilisateur,
                            et un token web JSON
  - Routes produits 
    - GET: /api/sauces => renvoie un tableau de toutes les sauces de la base de donnée
    - GET: /api/sauces/:id => renvoie la sauce avec l'id fourni
    - POST: /api/sauces => ajoute une nouvelle sauce à la base de donnée,
                        initialise les likes, dislikes, ainsi que les tableau                         usersLiked et usersDisliked.
                        Si une image est ajoutée, l'image est stockée sur le                         serveur
    - PUT: /api/sauces/:id => met à jour la sauce,
                          renvoie une nouvelle imageUrl si une image est                               ajoutée
    - DELETE : /api/sauces/:id => supprime la sauce de la base de donnée, et                                   l'image de la base de donnée
    - POST: /api/sauces/:id/like => définit le statut like ou dislike pour                                       l'userId fourni
 

## Paramètres
  - ajout d'un utilisateur : email(String) et password(String) (haché)
  - connexion au serveur : email(String) et password(String)
  - ajout d'une sauce : sauce(String) et image(File)
  - modification de la sauce : sauce(String) et image(File)
  - ajout d'un like/dislike : userId(String) et like(Number)
  

## Exemple de requête

Pour l'ajout d'une sauce 
```
sauce = {
  "name": "Hot Sauce",
  "manufacturer": "spicy factory",
  "description": "Have a taste of the hottest sauce!",
  "mainPepper": "Carolina Reaper",
  "heat": 10,
  "userId": "6788HHYFHGHH589H7HH456"
},
image = (binary)
```


## Exemple de réponse
ajout d'une sauce : 
```{message: "objet enregistré"} ```
