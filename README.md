# Dynaverse Experimental
#### Dynaverse at the present stage is a set of Microverse worlds to help and encourage kids to explore the world of programming in Metaverse that comprise the Snap<em>!</em> interface for creating and running card's scripts.

## Installation

```bash
mkdir Dynaverse
cd Dynaverse
```

```bash
git clone https://github.com/neolay/Snap.git
git clone https://github.com/neolay/microverse.git
git clone https://github.com/neolay/dynaverse.git
```

```bash
cd Snap
git checkout dynaverse-blocks
```

```bash
cd ../microverse
git checkout blocks
npm install
npm run build-lib
```

```bash
cd ../dynaverse
npm install
```

## Running
Open a Command Prompt or Terminal in the dynaverse repository and run:

```bash
npm start
```
Then go to [http://localhost:9684/](http://localhost:9684/)

## Blocks Editor
When you click on a card while the shift key pressed down, you get a blocks editor of the card. Enjoy it!

## Worlds List
- [http://localhost:9684?world=showblocks](http://localhost:9684?world=showblocks)
- [http://localhost:9684?world=pixel](http://localhost:9684?world=pixel)
- [http://localhost:9684?world=magic](http://localhost:9684?world=magic)
- [http://localhost:9684?world=racing](http://localhost:9684?world=racing)
