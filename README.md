# Welcome to the Github Repository for my website!
If you have not visited the website you can check it out here: https://robertsd1072.github.io/

I hope you enjoyed learning about me and are now excited to learn about the website itself and its development.

# Contents:
- Motivation and Upgrades from the First Version
- How I Reused Code
- How I used Model View Controller
- How I used Tests along side Implementation

# Motivation and Upgrades from the First Version
The first version of my website worked perfectly fined both in functionality and in conveying the information I wanted to convey, but it was done in haste and as a consequence was not  professional and did not fully use what I had learned at Pitt. So I decided to change those things and give the website much needed visual upgrades. I decided to replace one planet with a solar system and instead of the user controlling the rotation of the planet with their mouse, now the user controls a spaceship in its journey to explore the solar system. Of course I could not make a realistic solar system because the user would spend hours trying to find very small planets and possibly never finding anything. So I knew that I had to sacrifice realism for the sake of the user's experience. I also knew that I wanted to add lighting to the solar system as that would revive some realism and increase the website's **wow** factor. Finally, from the start of development, I used software engineering ideas. I took the extra time to develop reusable code which then saved me time later on. I separated data classes from the view and controller levels to fully implement Model View Controller. And last but not least, I used unit testing along side development to implement bug free functions which edited any object's current transformation matrix.

# How I Reused Code
As the user, it looks like the spaceship is moving and rotation within a solar system that doesn't move. However, that is not what is actually happening in the code. Instead, when the spaceship "moves," the solar system and its objects are translated in the opposing direction that the spaceship "moves." Likewise, when the spaceship "rotates," the solar system is rotated around the spaceship. The spaceship never changes locations or rotations; it is always in the same place. So to simulate movement and view direction changes, I developed the functions *moveSpaceshipView()* and *moveSpaceshipPhysicalLocation()* in *IndexController.js*. Using these two functions, the program simulates anything that requires moving the solar system and shifting the direction of view of the spaceship. This includes not just moving in the solar system but also orbiting a planet and landing on a planet. I developed those functions with the intent of reusing them for other operations and it benefited me immensely as I could simply call those functions instead of developing a entirely new function for a new operation.

Similarly, in developing a method for creating the vertices of the objects the user sees, I reused the same function for creating the star, all 7 planets in the solar system, and in creating the more detailed and elevated planet that the user sees when they land on a planet. One bad thing about creating objects in WebGL is that one often has to manually specify coordinates for each vertex so I was very happy to be able to reuse the same code in creating so many different objects.

# How I used Model View Controller
All data for each object is stored in the variable *solar_system_details*. Along with the classes Star, Planet, and Spaceship, that variable represents the **model** of my website. All variables in those classes are private and can only be edited or retrieved with setters and getters, respectively. All data pertaining to those objects in modified in those classes which the **controller**, *IndexController.js* can call. Due to the nature of animations in WebGL, global variables are required to pass information to the next iteration of animation. But when the **controller** interacts with the **model**, those global variables are passed in the form of local variables and are only available to that function call. 

The **controller**, *IndexController.js*, is responsible for receiving signals from the **view**, *index.html*, doing certain calculations before passing that data to the **model**, and passing the data returned from the **model** to the graphics card so the user sees the effects of their inputs. Animations are included in its responsibilities. 

# How I used Tests along side Implementation
A big part of this website is animation which is done by editing each object's current transformation matrix (*ctm*) every iteration. A *ctm*, when applied to a group of vertices can change the rotation, scale, and location of an object. I began this project knowing that these would be my biggest headache in development so I decided to use tests to prevent the development of functions that might work visually but not in actuality. 

For every function that edits an object's *ctm*, I first wrote a test which, after a certain amount of iterations, would check that the location of that object matched the desired result. After the test was written I would begin development of the function being tested. All tests can be found in *Tests.js*.

The following operations were tested in the manner outlined above:

- The orbit of planets around the star
- The simulated movement of the spaceships view left or right
- The simulated movement of the spaceship's physical location
- The spaceship's entry to orbit around a planet
- The spaceship's continuous orbit around a planet
- The orbit of the star around the planet when the user lands on a planet
- The simulated movement of the spaceship when the user lands on a planet