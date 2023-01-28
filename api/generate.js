import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
      max_tokens: 500,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Generate one image from the prompt.

Animal: {focus}
Names: {description} \n ![IMG](https://image.pollinations.ai/prompt/{description})
{description} = {focusDetailed},%20{adjective1},%20{adjective2},%20{visualStyle1},%20{visualStyle2},%20{visualStyle3},%20{artistReference}
Animal: Cat
Description: A photo of a cat on a couch, comfortable, cute, colourful, interior design, Ansel Adams

![IMG](https://image.pollinations.ai/prompt/a%20photo%20of%20a%20cat%20on%20a%20couch,%20comfortable,%20cute,%20colourful,%20interior%20photograph,%20interior design,%20Ansel Adams)

Animal: Fox with a Cloak
Description: A fox wearing a cloak, cinematic, heroic, professional photography, 4k, photo realistic, Tim Burton
![IMG](https://image.pollinations.ai/prompt/A%20fox%20wearing%20a%20cloak,%20cinematic,%20heroic,%20professional%20photography,%204k,%20photo%20realistic,%20Tim%20Burton)
Animal: ${capitalizedAnimal}
Description:`;
}
