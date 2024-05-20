const readline = require('readline');
const axios = require('axios');

const API_KEY = '';


const chalk = require('chalk');

// Create a function to log a message with a specific color
const consoleC = (message, color) => {
  console.log(chalk[color](message));
};

var histori = [


]


console.log("History len:" + histori.length);


const generateContent = async (userInput,cb) => {

    consoleC('User', 'red');
            
    consoleC(userInput,'grey');

    //cuantos objetos

    consoleC("history:" + histori.length,'cyan');


    histori.push(
        {
            "role": "user",
            "parts": [
              {
                "text": userInput
              }
            ]
        }  
    );
  const requestBody = {
    contents: histori,
    generationConfig: {
      temperature: 0.1,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
      stopSequences: [],
    },
    safetySettings: [
            {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_LOW_AND_ABOVE"
        },
            {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_LOW_AND_ABOVE"
        },
            {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_LOW_AND_ABOVE"
        },
            {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_LOW_AND_ABOVE"
        },
    ],
  };

  try {
    //'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: API_KEY,
        },
      }
    );
    var result = response.data["candidates"][0]["content"]["parts"][0].text;

    var size = JSON.stringify( response.data);

    cb(result,size.length);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

/*
// Example usage
const userInput = 'que dije en el mensaje anterior?';

generateContent(userInput,function(data){

    console.log(data);

});


const readline = require('readline');

// Función para generar contenido
function generateContent(input, callback) {
    // Aquí puedes realizar la lógica para generar contenido basado en la entrada
    const result = `Generando contenido para: ${input}`;
    callback(result);
}
*/
// Crear interfaz de línea de comandos
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para manejar la entrada del usuario
function getUserInput() {
    rl.question('Ingrese un mensaje o escriba "exit" para salir: ', function(userInput) {
        // Verificar si el usuario desea salir
        if (userInput.toLowerCase() === 'exit') {
            rl.close(); // Cerrar la interfaz de línea de comandos
        } else {
            // Llamar a la función de generación de contenido con la entrada del usuario
            generateContent(userInput, function(data,size) {
                

                consoleC('Result', 'blue');
            
                consoleC("#"+data,'grey');

                consoleC("Result Size:" + size + " bytes",'green');
    
                histori.push(
                    {
                        "role": "model",
                        "parts": [
                          {
                            "text": userInput
                          }
                        ]
                    }  
                );

                // Convertir el objeto a una cadena JSON
                const jsonString = JSON.stringify(histori);

                // Obtener el tamaño de la cadena en bytes
                const sizeInBytes = Buffer.from(jsonString).length;

                console.log("Bytes Usados :" +sizeInBytes);


                // Llamar recursivamente para obtener más entradas del usuario
                getUserInput();

            });
        }
    });
}

// Iniciar el bucle de entrada del usuario
getUserInput();