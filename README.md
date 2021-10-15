# warehouse-assistant
It is a performance tracking tool that motivates users to perform better at packing their orders.


> It was made all by me from the idea to the end-product on my own initiative.
> 
> Currently it is used by workers of Dagrofa from all three departments of a warehouse making up around 60 users who continue to rely on this app on daily basis.
> 
> ![](https://www.agrisj.com/wp-content/uploads/2021/05/kolli_assistant-finishing.gif)

Excerpt
-------

Warehouse production worker performance tracking tool

### The application allows user to:

See their momentary work performance

*   *   Through current status/performance indicators
    *   Through color-coding (red, yellow, green, pink and purple)

See their progress of the day

*   *   Through volume done
    *   Through hours passed
    *   Through items left
    *   Through orders done

Adjust numbers by daily needs

*   *   Start/End Times
    *   Effectivity goal
    *   Manipulate with non-work time (breaks, meetings and other)
    *   Undo function

### Technical wrap-up:

*   Progressive web application (React.js and Redux.js)
*   SCSS and Bulma
*   Local Storage instead of a backend

What it is
----------

It is a performance tracking tool that motivates users to perform better at packing their orders.

Background
----------

I have been a part-time warehouse worker in a food warehouse with 3 departments – frost, cool and fruits/vegetables. In production primary job is to pack orders on Euro pallets to be wrapped with plastic and packed in the delivery trucks. Workers are driving electric trucks with displays/computers on. Computers are used to see what items should be packed in an order.

Worker job performance is mainly rated by an Effectivity number which is calculated by how many kolli (items) are packed in an hour.

Problem
-------

There was no way to know precisely how fast one is working at any given time other than writing down the order size on a paper every time one receives a new order.

Paper and pen calculations take time and brain resources especially if one needs to calculate precise Effectivity number at the given time.

That is why I came up with a digital solution for this problem.

Features
--------

*   Color-coded display indicating both – performance status and kolli (item) volume;
*   Performance indicator showing user speed (color-coded);
*   Performance indicator showing performance status (ahead, behind…) and by how much (kolli and time);
*   List and count of orders;
*   Volume indicator showing how many hours a user has successfully fulfilled from the day load;
*   Second input field for immediate status update – to see user’s performance at ANY given time;
*   Undo button to correct wrong input;
*   Break register buttons to mark user break times;
*   Additional time adjustment buttons to add or remove time away from packing;
*   Pause button to record time away from packing;
*   Performance target manually changeable by user;

Challenges
----------

### Whole user experience

*   The App needs to be robust and easily updatable by users themselves
*   Ideally it should have been integrated into the main order management program;
*   Instead I used web browser opened in parallel (good call as later on the order app was moved to the browser too);
*   Both apps should be viewed in Fullscreen so I needed a way to easily switch between them;
*   I managed to configure physical buttons on the computer screen itself to switch between windows;
*   I also set both apps as Home pages so they always open with the browser itself;
*   I also set the browser to open on Startup;
*   This is almost as close as it gets before total integration of the two apps;

### Saving performance data if computer is restarted (eg because of the truck battery change)

*   I used Local Storage to save the day’s data as I wanted to keep it simple without implementing any database solution;

Tehnical Challanges
-------------------

*   Time manipulation – calculating hours and adding/subtracting from the running time
*   Visual hour dividers – showing them dynamically and correctly required a lot of work


Previews
========

Setting Start/End Time
----------------------

![](https://www.agrisj.com/wp-content/uploads/2021/05/kolli_assistant-setting_time.gif)

Using Undo
----------

![](https://www.agrisj.com/wp-content/uploads/2021/05/kolli_assistant-using_undo.gif)

Using Break
-----------

![](https://www.agrisj.com/wp-content/uploads/2021/05/kolli_assistant-using_break.gif)

Using Pause
-----------

![](https://www.agrisj.com/wp-content/uploads/2021/05/kolli_assistant-using_pause.gif)

Using Instant Feedback
----------------------

![](https://www.agrisj.com/wp-content/uploads/2021/05/kolli_assistant-using_instant_feedback.gif)
