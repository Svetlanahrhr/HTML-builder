const fs = require('fs');
const path = require('path');
const process = require('process');
const { stdin, stdout } = process;


    fs.writeFile(path.join(__dirname, 'text.txt'), 'Анкета студента 1\n', (err) => {
        if (err) throw err;
    });
    stdout.write('Как тебя зовут?\n')
    stdin.on('data', data => {
        if (data.toString().trim() == 'exit') {
            stdout.write('Ну и пока(\n')
            process.exit(); 
        } else {
            fs.appendFile(path.join(__dirname, 'text.txt'), data, (err) => {
            if (err) throw err;
            });
            stdout.write('Напиши за что ты вычтешь 10 баллов? или введи exit\n')
        }
    });
    




