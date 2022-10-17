'use strict';   // Mode strict du JavaScript

/*************************************************************************************************/
/* **************************************** DONNEES JEU **************************************** */
/*************************************************************************************************/

let game;

const PLAYER = 'player';
const DRAGON = 'dragon';

const LEVEL_EASY   = 1;
const LEVEL_NORMAL = 2;
const LEVEL_HARD   = 3;

const CLASS_KNIGHT    = 1;
const CLASS_THIEF     = 2;
const CLASS_MAGICIAN  = 3;

/*************************************************************************************************/
/* *************************************** FONCTIONS JEU *************************************** */
/*************************************************************************************************/


/**
 * Détermine qui du joueur ou du dragon prend l'initiative et attaque
 * @returns {string} - DRAGON|PLAYER
 */
function getAttacker()
{
    let playerInitiative = throwDices(10, 6);
    let dragonInitiative = throwDices(10, 6);

    if(game.classPlayer == CLASS_THIEF){
        playerInitiative += Math.round(playerInitiative * throwDices(1, 6) / 100);
    }

    if( playerInitiative > dragonInitiative ){
        return PLAYER;
    }

    return DRAGON;
}

/**
 * Calcule les points de dommages causés par le dragon au chevalier
 * @returns {number} - le nombre de points de dommages
 */
function computeDamagePoint(attacker)
{
    let damagePoints = throwDices(3, 6);

   
    switch (game.level) {
        case LEVEL_EASY:
            
            if( attacker == DRAGON ) {
              damagePoints -= Math.round(damagePoints * throwDices(2, 6) / 100);
            }
            else {
              damagePoints += Math.round(damagePoints * throwDices(2, 6) / 100);
            }
            break;

        case LEVEL_HARD:
            
            if( attacker == DRAGON ) {
              damagePoints += Math.round(damagePoints * throwDices(1, 6) / 100);
            }
            else {
              damagePoints -= Math.round(damagePoints * throwDices(1, 6) / 100);
            }
            break;
    }

    return damagePoints;
}

/**
 * Boucle du jeu : répète l'exécution d'un tour de jeu tant que les 2 personnages sont vivants
 */
function gameLoop()
{
    while(game.hpDragon > 0 && game.hpPlayer > 0) {

        let attacker = getAttacker();

        let damagePoints = computeDamagePoint(attacker);

        if(attacker == DRAGON) {

          if(game.classPlayer == CLASS_KNIGHT){
              damagePoints -= Math.round(damagePoints * throwDices(1, 10) / 100);
          }

          game.hpPlayer -= damagePoints; 
        }
        else { 
          if(game.classPlayer == CLASS_MAGICIAN){
            damagePoints += Math.round(damagePoints * throwDices(1, 10) / 100);
          }

          game.hpDragon -= damagePoints; 
        }

       
        showGameLog(attacker, damagePoints);

       
        showGameState();

        
        game.round++;
    }
}


function initializeGame()
{
    
    game       = new Object();
    game.round = 1;

    
    game.level = requestInteger
    (
        'Choisissez le niveau de difficulté\n' +
        '1. Facile - 2. Normal - 3. Difficile',
        1, 3
    );

    
    game.classPlayer = requestInteger
    (
        'Quelle classe choisissez-vous pour votre héro ?\n' +
        '1. Chevalier - 2. Voleur - 3. Magicien',
        1, 3
    );

    
    switch(game.level) {
        case LEVEL_EASY:
            game.hpDragon = 100 + throwDices(5, 10);
            game.hpPlayer = 100 + throwDices(10, 10);
            break;

        case LEVEL_NORMAL:
            game.hpDragon = 100 + throwDices(10, 10);
            game.hpPlayer = 100 + throwDices(10, 10);
            break;

        case LEVEL_HARD:
            game.hpDragon = 100 + throwDices(10, 10);
            game.hpPlayer = 100 + throwDices(7, 10);
            break;
    }

    
    game.hpDragonStart = game.hpDragon;
    game.hpPlayerStart = game.hpPlayer;
}


function showGameState()
{
    
    let imageFilePlayer = 'knight.png';
    let imageFileDragon = 'dragon.png';

   
    const pourcentageHpDragon = game.hpDragon * 100 / game.hpDragonStart;
    if (pourcentageHpDragon < 30) {
      imageFileDragon = 'dragon-wounded.png';
    }

    const pourcentageHpPlayer = game.hpPlayer * 100 / game.hpPlayerStart;
    if (pourcentageHpPlayer < 30) {
      imageFilePlayer = 'knight-wounded.png';
    }

    
    document.write('<div class="game-state">');

    
    document.write('<figure class="game-state_player">');
    document.write('<img src="images/' + imageFilePlayer + '" alt="Chevalier">');

    
    if (game.hpPlayer > 0) {
        document.write('<figcaption><progress max="100" value="' + pourcentageHpPlayer + '"></progress>' + game.hpPlayer + ' PV</figcaption>');
    } else { 
        document.write('<figcaption>Game Over</figcaption>');
    }

    document.write('</figure>');

    
    document.write('<figure class="game-state_player">');
    document.write('<img src="images/' + imageFileDragon + '" alt="Dragon">');

    
    if (game.hpDragon > 0) {
        document.write('<figcaption><progress max="100" value="' + pourcentageHpDragon + '"></progress>' + game.hpDragon + ' PV</figcaption>');
    } else { 
        document.write('<figcaption>Game Over</figcaption>');
    }

    document.write('</figure>');
    document.write('</div>');
}

/**
 * Affiche ce qu'il s'est passé lors d'un tour du jeu : qui a attaqué ? Combien de points de dommage ont été causés ?
 * @param {string} attacker - Qui attaque : DRAGON ou PLAYER
 * @param {number} damagePoints - Le nombre de points de dommage causés
 */
function showGameLog(attacker, damagePoints)
{
    let imageFilename;
    let alt;
    let message;

   
    if (attacker == DRAGON) {
        imageFilename = 'dragon-winner.png';
        alt = 'Dragon vainqueur';
        message = 'Le dragon prend l\'initiative, vous attaque et vous inflige ' + damagePoints + ' points de dommage !';
    }
    else { 
        imageFilename = 'knight-winner.png';
        alt = 'Chevalier vainqueur';
        message = 'Vous êtes le plus rapide, vous attaquez le dragon et lui infligez ' + damagePoints + ' points de dommage !';
    }

    
    document.write('<h3>Tour n°' + game.round + '</h3>');
    document.write('<figure class="game-round">');
    document.write('<img src="images/' + imageFilename + '" alt="'+ alt +'">');
    document.write('<figcaption>' + message + '</figcaption>');
    document.write('</figure>');
}


function showGameWinner()
{
    let imageFilename;
    let alt;
    let message;

    if(game.hpDragon > 0) {
        imageFilename = 'dragon-winner.png';
        alt = 'Dragon vainqueur';
        message = 'Vous avez perdu le combat, le dragon vous a carbonisé !';
    }
    else {  
        imageFilename = 'knight-winner.png';
        alt = 'Chevalier vainqueur';
        message = 'Vous avez vaincu le dragon, vous êtes un vrai héros !';
    }

    document.write('<footer>');
    document.write('<h3>Fin de la partie</h3>');
    document.write('<figure>');
    document.write('<figcaption>' + message + '</figcaption>');
    document.write('<img src="images/' + imageFilename + '" alt="'+ alt +'">');
    document.write('</figure>');
    document.write('</footer>');
}


function startGame()
{
   
    initializeGame();

   
    showGameState();
    gameLoop();

    
    showGameWinner();
}



/*************************************************************************************************/
/* ************************************** CODE PRINCIPAL *************************************** */
/*************************************************************************************************/

startGame();
