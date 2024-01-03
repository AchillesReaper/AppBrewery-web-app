/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs'

inquirer
    // 1. Use the inquirer npm package to get user input.
    .prompt([
        {
            message: "Type in your URL: ",
            name: "URL"
        }
    ])
    .then((ans) => {
        // 2. Use the qr-image npm package to turn the user entered URL into a QR code image.
        const qr_svg = qr.image(ans.URL)
        qr_svg.pipe(fs.createWriteStream('qr_code1.png'))

        // 3. Create a txt file to save the user input using the native fs node module.
        fs.writeFile('URL_1.txt', ans.URL, (err) => {
            if (err) throw err;
            console.log('url file saved');
        })

    })
    .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          // Something else went wrong
        }
      });
