![alt text](src/images/logo-quizzes-font-honk--smaller.png)

# <div id='s1' />Content Editable Web Quiz App

![alt text](docs/preview.png)
![alt text](docs/preview-admin.png)

## Table of contents

- [Features](#s0-1)
- [First time access](#s1-1)
- [Editing content](#s1-2)
  - [Adding a quiz](#s1-2-1)
  - [Editing a quiz](#s1-2-2)
  - [Deleting a quiz](#s1-2-3)
- [Limitations](#s1-3)
  - [Netlify](#s1-3-1)
  - [Multiple same values](#s1-3-2)
  - [Minor string format limitation](#s1-3-3)
- [Dev notes](#s1-5)
  - [Local development](#s1-5-1)
- [ Further options](#s1-6)
- [ Copyrights](#s1-7)
- [ Authors](#s1-8)

## <div id='s0-1' />Features

App is statically built during build process thanks to which doesn't require any api calls which speeds up the website access.

To store content, a Git based CMS was chosen, thanks to which APP does not require any additional backend code or hosting.

https://decapcms.org/docs/intro/

## <div id='s1-1' />First time access

App is currently visible at:

> https://cms-quiz-demo.netlify.app/

and admin customization panel:

> https://cms-quiz-demo.netlify.app/admin/

for demo purposes, registration is set to open and doesn't require email confirmation.

you can use also a test user:

email: test1@test.com
password: test1

## <div id='s1-2' />Editing content

WARNING: All content edition actions, after clicking "Publish", or "Delete" will trigger site update command, using part of Netlify's build limit. Feel free to test. Limit is however around 100-150 actions per month, something to take into account.

### <div id='s1-2-1' />Adding a quiz

go to the development website `/admin` url:

> https://cms-quiz-demo.netlify.app/admin/

Click new Quiz:

![alt text](docs/image.png)

Fill out the required fields:

![alt text](docs/image-1.png)

Click "Publish":

![alt text](docs/image-2.png)

### <div id='s1-2-2' />Editing a quiz

In main admin panel, click on a quiz to edit:

![alt text](docs/image-3.png)

Change fields value, and click "Publish"

![alt text](docs/image-2.png)

### <div id='s1-2-3' />Deleting a quiz

![alt text](docs/image-6.png)

## <div id='s1-3' />Limitations

### <div id='s1-3-1' />Netlify

Netlify in free plan has around 300 build minutes / month.

This allows for around 100-150 content alterations (100-150 site update commands).

Usual site update time is around 1-2min after a Publish.

### <div id='s1-3-2' />Multiple same values

Multiple same values for answers / subcategories inside single quiz are not supported.

### <div id='s1-3-3' />Minor string format limitation

Adding a time-like string (f.e. 3:45) as title may result in the field being considered a number for some reason and prevent site build. This can be worked around by adding a " " (space) sign to the string.

This is most likely a Decap CMS issue.

## <div id='s1-5' />Dev notes

Project is build with Gatsby and Decap CMS.

In case of need, it is best to refer to the above framework providers.

### <div id='s1-5-1' />Local development

> gatsby develop

and in another terminal, run server for local backend:

> npx decap-server

**warning: this is an important step, as without it changes in local admin panel will result in remote repository update**

## <div id='s1-6' /> Further options

With Decap CMS it is possible to upload files as content. This opens door for possibilities like for example quizzes having a customized "banner-image" set by content editors.

## <div id='s1-7' /> Copyrights

I hereby prohibit from re-distributing, copying, reselling, or re-using the code or its parts in any form.

The code is made public only for demonstration purposes.

## <div id='s1-8' /> Authors

Tomasz Kożuch

kozuch.tomasz1@gmail.com

https://github.com/tkozuch/
