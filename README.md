# ChromeTimeTracker - Get The Chrome Extension:
https://chrome.google.com/webstore/detail/chrome-time-tracker/dcfplhjfgeeffdagbenbdmmccdkjanon/related?hl=en-GB&authuser=0
Uploads your screen time as Google calendar events.

## Relevance

This Chrome extension will help objectify how your social media time is really spent. The extension uploads your screen time from popular social media websites to your Google calendar. Correctly perceiving your time on social media is often a problem, because these platforms are a dopamine feast for our “monkey” brains, and it’s been shown that: “increased dopamine release speeds up an animal's subjective sense of time” (Simen, 2018). Many of us don’t realize how long we actually spend on these social media platforms. 

It’s also important to recognize exactly the time of day when we are using these social media platforms. Often we plan to study, just to get side tracked by social media. It’s important to objectively understand how often this happens to us. Moreover, once we return to studying, it's increasingly more difficult. This is yet again due to dopamine. As we have now concretely learned, social media releases a lot of dopamine. The issue is, our brain can only create so much of it. Once we leave social media our dopamine level doesn’t drop back to baseline, but actually below (Lembke, 2021)! Since dopamine is what makes us feel good, we return to studying in a deficit and not feeling as “good”. Moreover a lack of dopamine, makes us less motivated and excited about things, such as studying (Healthdirect, 2021). 

## How it works 

In short, it works by collecting the start time (when you first view the website) and the end time (when you leave the website). Once you leave the website an event will be created in your Google Calendar, with the respective start and end times, and also with the title of the social media website you visited. You can also customize the websites you wish to track screen time for.

## Technical Specifics:
* Used OAuth 2.0 to Access Google APIs, such as read and write to user's Google Calender.
* Leveraged Google's Extension APIs: chrome.storage, chrome.identity, chrome.window, chrome.tabs.


*You must view the webpage for more than one minute for the screen time session to be uploaded to your Google calendar.*

Download it on the Chrome Web Store:
https://chrome.google.com/webstore/detail/chrome-time-tracker/dcfplhjfgeeffdagbenbdmmccdkjanon/related?hl=en-GB&authuser=0

## Sources

Simen, P and Matell, M. (2018, July 12). Why does time seem to fly when we’re having fun?
Retrieved from https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6042233/

Anna Lembke. (2021, November 7). Your brain on social media [Video]. YouTube. https://www.youtube.com/watch?v=eaFLrWZavG8&feature=youtu.be

Dopamine. (2021, April). Healthdirect. https://www.healthdirect.gov.au/dopamine

