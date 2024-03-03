# Content Editable Web Quiz App

This app's purpose is to provide UI for quiz creation for non-technical people (CMS layer).

Administrator users will be able to access the `/admin` endpoint and in a friendly UI be able to
configure quizzes, hosted on the website.

They will be able to provide simple quizzes for the app users to play.

## Editing content

WARNING: All content edition actions, after clicking "Publish", or "Delete" will trigger site update command, and use a part of Netlify's build limit.

### Adding a quiz

go to the development website `/admin` url:

(at the time of writing):

> https://cms-quiz-app.netlify.app/admin/

Click new Quiz:

![alt text](docs/image.png)

Fill out the required fields:

![alt text](docs/image-1.png)

Click "Publish":

![alt text](docs/image-2.png)

### Editing a quiz

In main admin panel, click on a quiz to edit:

![alt text](docs/image-3.png)

Change fields value, and click "Publish"

![alt text](docs/image-2.png)

### Deleting a quiz

![alt text](docs/image-6.png)

## Limitations / features / issues

### Netlify

Netlify in free plan has around 300 build minutes / month.

This allows for around 100-150 content alterations (100-150 site update commands).

Usual site update time is around 1-2min.

### Known issues

#### Minor string format limitation

Where entering a string which seems like an hour format (for example "2:56"), it is being recognized as number
and might prevent site from updating.

Best is to avoid hour-like strings, as values set in admin panel fields.

This could be workedaround by adding a " " (space) or a letter to the string.

### Multiple same values

At the time of writing it is best to avoid same values for subcategories within a quiz, or same answers values per quiz (also same answers in different subcategories of the same quiz are not currently supported).

### Netlify admin panel

To enter the Website's hosting provider go to:

https://app.netlify.com/

and click "Log in with email"

Credentials to the account will be provided in another file.

On the main dashboard page, you can see information like remaining build minutes or bandwidth used:

![alt text](./docs/image-5.png)

Under "Builds", you can also see the status of latest-triggered website updates.
