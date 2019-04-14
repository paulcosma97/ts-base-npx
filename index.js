#!/usr/bin/env node
const {exec} = require('child_process');
const logger = require('@jeaks03/logger').default;
const fs = require("fs");
const path = require("path");

const validParams = ['--overseer', '-o'];

const fileNameIndex = validParams.includes(process.argv[2]) ? 3 : 2;
const installOverseer = validParams.includes(process.argv[fileNameIndex === 2 ? 3 : 2]);

const fileName = process.argv[fileNameIndex] || 'typescript-base';
const logHeader = 'TSBase';

(function() {
    if(fs.existsSync(path.join('.', fileName))) {
        return logger.error(logHeader, 'A file with the name {} already exists here', fileName);
    }
    
    logger.info(logHeader, 'Cloning base repository into ./{}', fileName)
    exec('git clone https://github.com/paulcosma97/typescript-base.git' + (process.argv[fileNameIndex] ? ' ' + fileName : ''), (err) => {
        if(err) {
            logger.error(logHeader, 'Could not complete repository cloning');
            return console.error(err.message);
        }
    
        logger.info(logHeader, 'Installing node dependencies')
        process.chdir(path.join('.', fileName));
        exec('npm i', (err) => {
            if(err) {
                logger.error(logHeader, 'Could not install npm dependencies');
                return console.error(err.message);
            }

            if(installOverseer) {
                logger.info(logHeader, 'Setting up Overseer Framework');
                exec('npm i @jeaks03/overseer-core', (err) => {
                    if(err) {
                        logger.error(logHeader, 'Could not install Overseer Framework');
                        return console.error(err.message);
                    }

                    fs.mkdirSync(path.join('.', 'resources'));
                    fs.mkdirSync(path.join('./resources', 'public'));

                    logger.info(logHeader, 'Installation is now complete');
                    logger.info(logHeader, 'Execute `npm run dev` to run the application');

                });
            } else {
                logger.info(logHeader, 'Installation is now complete');
                logger.info(logHeader, 'Execute `npm run dev` to run the application');
            }
    
        });
    
    });
})()

