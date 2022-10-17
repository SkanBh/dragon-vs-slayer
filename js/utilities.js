'use strict';   // Mode strict du JavaScript

/*************************************************************************************************/
/* *********************************** FONCTIONS UTILITAIRES *********************************** */
/*************************************************************************************************/


/**
 * Demande à l'utilisateur un entier entre 2 bornes et retourne cet entier
 * @param {string} message Le message affiché à l'utilisateur dans la boîte de dialogue
 * @param {number} min La borne minimale
 * @param {number} max La borne maximale
 * @returns {number}
 */
function requestInteger(message, min, max)
{
    var integer;

    do
    {
        integer = parseInt(window.prompt(message));
    }
    while(isNaN(integer) == true || integer < min || integer > max);

    return integer;
}


/**
 * Tire un entier au hasard et le retourne
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function getRandomInteger(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Simule un lancé de dés (throw = jeter / dices = dés )
 * @param {number} dices - Nombre de dés que l'on souhaite lancer
 * @param {number} sides - Nombre de faces par dé
 * @returns {number} - Le total de la somme des dés
 */
function throwDices(dices, sides)
{
    var index;
    var sum;

    sum = 0;

    
    for(index = 0 ; index < dices ; index++){
      sum += getRandomInteger(1, sides);
    }

    return sum;
}
