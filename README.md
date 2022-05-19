# BP 
Krátke vysvetlenie štruktúry daného repozitára, s ktorým sme si pomáhali v bakalárskej práci. V krátkosti si objasníme, kde čo najdeme a na čo dané súbory slúžia. 
Postupne budeme rozoberať každý priečinok, ktorý sa nachádza v hlavnom priečinku **codes**, každý skript a jeho využitie a aj výsledky simulacií.

##  [mangKung](https://github.com/devAdam117/bp/tree/main/codes/mangKung)

 - ### [fixneOutputy](https://github.com/devAdam117/bp/tree/main/codes/mangKung/fixneOutputy)
folder v ktorom sa nachádzaju výsledky prebehnutých simulácií. Vysvetlenie o aké simulácie sa jedná a kde v práci sa s nimi narábalo najdeme v samotnom priečinku a následne v súbore mangKu]([
](https://github.com/devAdam117/bp/tree/main/codes/mangKung)ngReadme.txt
 - ### [basicSimulation.js](https://github.com/devAdam117/bp/blob/main/codes/mangKung/basicSimulation.js)
Základny skript, ktorý spusti 1000 krát hru Mang Kung bez nejakých modifikácií. Po spustení skriptu sa zobrazia rôzne štatistické výsledky simulácií v konzole.
 - ### [b.js](https://github.com/devAdam117/bp/blob/main/codes/mangKung/b.js)
 Skript, pomocou ktorého zisťujeme či fixne volený hráč na začiatku hry má väčšiu pravdepodobnosť výhry
 - ### [c.js](https://github.com/devAdam117/bp/blob/main/codes/mangKung/c.js) 
 Skript, pomocou ktorého zisťujeme či fixne volený hráč na začiatku hry má väčšiu očakávanú výhru ako ostatní hráči
 
- ### [g.js](https://github.com/devAdam117/bp/blob/main/codes/mangKung/g.js)
 Skript, pomocou ktorého zisťujeme aké by bolo potrebné množstvo žetónov na dokončenie jednej hry s pravdepodobnosťou 100-alfa %
- ### [kocky.js](https://github.com/devAdam117/bp/blob/main/codes/mangKung/kocky.js) 
Skript, ktorý vytvára voliteľný počet kociek, ktoré sa používajú v ďalších skriptoch
- ### [mangKung.js](https://github.com/devAdam117/bp/blob/main/codes/mangKung/mangKung.js)
 Skript, ktorý v sebe nesie zakladnú logiku hry. Používa sa vo všetkých ostatných skriptoch spojených s hrou Mang Kung
- ### [output.txt](https://github.com/devAdam117/bp/blob/main/codes/mangKung/output.txt)
 Textový súbor, do ktorého sa ukladajú po spusteni skriptu výsledky simulacií

## dvanastka
- ### fixneOutputy
 folder v ktorom sa nachádzaju výsledky prebehnutých simulácií. Vysvetlenie o aké simulácie sa jedná a kde v práci sa s nimi narábalo najdeme v samotnom priečinku a následne v súbore dvanastkaReadme.txt
- ### R
R-kovský súbor, ktorý slúžil na numerické výpočty p_n, lambda_n ako ja na  výpočty konštanty c_n
- ### a.js
Skript pomocou, ktorého sme spustili základny koncept hry 10 000 0000 krát. Vždy sme zaznamenali na akom čísle sme po prekročení skončili.
- ### output.txt
 Textový súbor, do ktorého sa ukladajú po spusteni skriptu výsledky simulacií


## squidGame
- ### fixneOutputy
folder v ktorom sa nachádzajú výsledky prebehnutých simulácií. Vysvetlenie o aké simulácie sa jedná a kde v práci sa s nimi narábalo najdeme v samotnom priečinku a následne v súbore squidGame.txt
- ### squidGame.js
Skript pomocou, ktorého sme simulovali priebeh hry so 16 hráčmi a 18 platformami s využitím 1 000 000 simulácií.
- ### output.txt
 Textový súbor, do ktorého sa ukladajú po spusteni skriptu výsledky simulacií
