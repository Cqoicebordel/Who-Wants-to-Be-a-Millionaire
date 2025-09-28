# This fork

This fork was created to be used by a French Twitch creator, with custom made questions. So lots of things were changed to adapt to that format.

First of all, the layout : the UI is separated in three parts. The left part is for the user control, settings, etc. The central part is the question with most of the UI, and the right part is levels. The central and right part can be captured separately, while the central part use limited vertical space to allow a host to add a camera view above it.

Of course, there were also language and money symbol changes.

But also a few tools were added, like the possibility to set the volume, or to jump to a specific question, etc.

You can see a [preview of the interface](https://cqoicebordel.net/Who-Wants-to-Be-a-Millionaire/)

# Usage

To "install" this game, you will need a simple webserver that can serve static files (Apache will do). You simply upload this git repository into a folder on the web server, and access index.html in your browser.


The game loads a question bank (default questions.json) in the same root directory as index.html. This file contains the game-seperated question sets described in the next section.

To adapt to your country, or just the messages shown, you'll have to edit the `index.html` file. You'll also have to edit the `style.css` twice to adapt the money symbol.

# Scraping / Question bank

To make question harvesting easier, I included a python script in /util that scrapes indiabix.com for questions.

The root directory has questions.json which is the main question file, and another question set stored in questions2.json. The program only reads questions.json.

# Creating questions

As this fork was created to use custom questions, I built a tool which is in `util/convert-csv-json.py` to allow conversion between a CSV to the JSON format used by this interface. Read the first few lines of the script to understand what you need to do.

Note that if you want to build multiples games, you just have to provide a CSV with more than 15 questions : each 15 questions, a new game is built automatically.

# Question format

The question bank is simply an array of "games". You can have as many "games" as you like. You select them at the beginning of loading index.html.

	{
		"games" : [
			{
				"questions" : [ ... ]
			},
			{
				"questions" : [ ... ]
			}, ...
		]
	}

Each array of questions is in the following format.

1.	"content" is the key for the possible answer texts. "content" must have a length of 4 (4 multiple choices).
2.	The question prompt text is located in the key "question"
3.	The zero-based index of the value in "content" that is the correct answer is located in the key "correct"



	    {
	        "question" : "What is Aurora Borealis commonly known as?",
	        "content" : [
	            "Fairy Dust",
	            "Northern Lights",
	            "Book of ages",
	            "a Game of Thrones main character"
	        ],
	        "correct" : 1
	    }


# Who Wants to Be a Millionaire Materials

The sounds and images used from Who Wants to Be a Millionaire, and the questions used from India-Bix and other sources are not mine, nor do I claim any involvement in their creation. The materials are used under Fair Use for academic and educational purpose, and should not be redistributed otherwise without permission from their creators.

The added sounds for this fork are from this [Youtube video](https://www.youtube.com/watch?v=MForOVuA6hs).

The background image and the images of the jokers are from [Kaloo](http://www.pascallamarque.com), who was a huge help. He also did several extra images that are specific to the Twitch creator, so sadly are not in this repo.

Also, a huge thanks to the [Gilles Stella](https://www.twitch.tv/gilles_stella) community for their help and for writing lots of fun questions ! The [Gilles Stella Discord](https://discord.gg/EfGkkvV9) is awesome !
