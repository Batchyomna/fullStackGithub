const myMongo = require('mongodb').MongoClient //Créer une nouvelle instance MongoClient
const url = 'mongodb://localhost:27017'// determiner url où mongoDB va se connecter
const express = require('express');// déclarer express comme un variable du modéle express
const app = express()// app notre server express

const port = 8000//la porte de où nptre server express va entendre les demandes
async function createCollection() { //declarer une fonction async qui va créer la connexion avec MongoDB
    try {
        let myData = await myMongo.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }) //céer une connexion avec MongoDb qui va nous donner des data, on va les garder dans le variable myData
        // Comme les méthodes(connect, createCollection) sont async( ils ont besoin du temps pour s'éxécuter) on a besoin toujours await avant tous
        var myDataBase = myData.db("FullStack")//créer base à donnes qui s'appelle (FullStack) avec la méthode db
        await myDataBase.createCollection("Students")//avec le variable(myDataBase) qui coresponde notre base à donne on va créer nouvelle collection
        await myDataBase.createCollection("Groups")//créer une autre collection s'appelle Groupe
    } catch (err) {// si le programme a trouver un problème avec (try) il va entrer dans (catch) pour afficher l'erreur et fermer la base à donné
    console.log(err)
    myData.close()

}
}
createCollection()//appeler la fonction qui va créer la connexion avec la bas à donné et rependre à API demandes
