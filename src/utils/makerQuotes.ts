// Curated quotes from makers, inventors, designers, and engineers
// All from historical figures (pre-1995)
// Screened for appropriateness and focused on creation, innovation, and making

export interface MakerQuote {
  text: string;
  author: string;
  year?: string;
}

export const makerQuotes: MakerQuote[] = [
  // Thomas Edison
  { text: "Genius is one percent inspiration and ninety-nine percent perspiration.", author: "Thomas Edison", year: "1903" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison", year: "1910" },
  { text: "There's a way to do it better - find it.", author: "Thomas Edison", year: "1920" },
  { text: "The value of an idea lies in the using of it.", author: "Thomas Edison" },
  { text: "To invent, you need a good imagination and a pile of junk.", author: "Thomas Edison" },
  
  // Leonardo da Vinci
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", year: "1494" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "I have been impressed with the urgency of doing.", author: "Leonardo da Vinci" },
  { text: "Art is never finished, only abandoned.", author: "Leonardo da Vinci" },
  { text: "The noblest pleasure is the joy of understanding.", author: "Leonardo da Vinci" },
  
  // Nikola Tesla
  { text: "The present is theirs; the future, for which I really worked, is mine.", author: "Nikola Tesla", year: "1905" },
  { text: "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.", author: "Nikola Tesla" },
  { text: "The day science begins to study non-physical phenomena, it will make more progress in one decade than in all the previous centuries.", author: "Nikola Tesla" },
  { text: "Be alone, that is the secret of invention; be alone, that is when ideas are born.", author: "Nikola Tesla" },
  { text: "The scientific man does not aim at an immediate result.", author: "Nikola Tesla" },
  
  // Benjamin Franklin
  { text: "Tell me and I forget, teach me and I may remember, involve me and I learn.", author: "Benjamin Franklin", year: "1750" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Either write something worth reading or do something worth writing.", author: "Benjamin Franklin" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
  { text: "Without continual growth and progress, such words as improvement, achievement, and success have no meaning.", author: "Benjamin Franklin" },
  
  // Wright Brothers
  { text: "It is possible to fly without motors, but not without knowledge and skill.", author: "Wilbur Wright", year: "1901" },
  { text: "The desire to fly is an idea handed down to us by our ancestors who looked enviously on the birds.", author: "Wilbur Wright" },
  { text: "I confess that in 1901 I said to my brother that man would not fly for fifty years.", author: "Wilbur Wright", year: "1908" },
  
  // Alexander Graham Bell
  { text: "Before anything else, preparation is the key to success.", author: "Alexander Graham Bell" },
  { text: "When one door closes, another opens; but we often look so long and so regretfully upon the closed door that we do not see the one which has opened for us.", author: "Alexander Graham Bell" },
  { text: "The inventor looks upon the world and is not contented with things as they are.", author: "Alexander Graham Bell" },
  
  // Henry Ford
  { text: "Whether you think you can, or you think you can't – you're right.", author: "Henry Ford", year: "1947" },
  { text: "Failure is simply the opportunity to begin again, this time more intelligently.", author: "Henry Ford" },
  { text: "Quality means doing it right when no one is looking.", author: "Henry Ford" },
  { text: "Coming together is a beginning; keeping together is progress; working together is success.", author: "Henry Ford" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
  
  // Marie Curie
  { text: "Nothing in life is to be feared, it is only to be understood.", author: "Marie Curie", year: "1920" },
  { text: "I was taught that the way of progress was neither swift nor easy.", author: "Marie Curie" },
  { text: "Be less curious about people and more curious about ideas.", author: "Marie Curie" },
  { text: "One never notices what has been done; one can only see what remains to be done.", author: "Marie Curie" },
  
  // Buckminster Fuller
  { text: "You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete.", author: "Buckminster Fuller", year: "1970" },
  { text: "I'm not a genius. I'm just a tremendous bundle of experience.", author: "Buckminster Fuller" },
  { text: "When I am working on a problem, I never think about beauty but when I have finished, if the solution is not beautiful, I know it is wrong.", author: "Buckminster Fuller" },
  { text: "Everyone is born a genius, but the process of living de-geniuses them.", author: "Buckminster Fuller" },
  
  // Charles Kettering
  { text: "A problem well stated is a problem half solved.", author: "Charles Kettering", year: "1960" },
  { text: "The world hates change, yet it is the only thing that has brought progress.", author: "Charles Kettering" },
  { text: "An inventor fails 999 times, and if he succeeds once, he's in.", author: "Charles Kettering" },
  { text: "Keep on going, and the chances are that you will stumble on something, perhaps when you are least expecting it.", author: "Charles Kettering" },
  
  // Isaac Newton
  { text: "If I have seen further it is by standing on the shoulders of Giants.", author: "Isaac Newton", year: "1675" },
  { text: "To every action there is always opposed an equal reaction.", author: "Isaac Newton", year: "1687" },
  { text: "Truth is ever to be found in simplicity, and not in the multiplicity and confusion of things.", author: "Isaac Newton" },
  
  // Galileo Galilei
  { text: "All truths are easy to understand once they are discovered; the point is to discover them.", author: "Galileo Galilei" },
  { text: "I have never met a man so ignorant that I couldn't learn something from him.", author: "Galileo Galilei" },
  { text: "Measure what is measurable, and make measurable what is not so.", author: "Galileo Galilei", year: "1610" },
  
  // Johannes Gutenberg
  { text: "It is a press, certainly, but a press from which shall flow in inexhaustible streams the most abundant and most marvelous liquor that has ever flowed to relieve the thirst of men.", author: "Johannes Gutenberg", year: "1450" },
  
  // George Washington Carver
  { text: "Where there is no vision, there is no hope.", author: "George Washington Carver" },
  { text: "When you do the common things in life in an uncommon way, you will command the attention of the world.", author: "George Washington Carver" },
  { text: "Education is the key to unlock the golden door of freedom.", author: "George Washington Carver" },
  { text: "No individual has any right to come into the world and go out of it without leaving behind distinct and legitimate reasons for having passed through it.", author: "George Washington Carver" },
  
  // Orville Wright
  { text: "If we all worked on the assumption that what is accepted as true is really true, there would be little hope of advance.", author: "Orville Wright" },
  
  // James Watt
  { text: "I can think of nothing else but this machine.", author: "James Watt", year: "1765" },
  
  // Samuel Morse
  { text: "What hath God wrought!", author: "Samuel Morse", year: "1844" },
  
  // Eli Whitney
  { text: "I have not only arms but a great deal of money which is of great importance.", author: "Eli Whitney", year: "1798" },
  
  // George Eastman
  { text: "What we do during our working hours determines what we have; what we do in our leisure hours determines what we are.", author: "George Eastman" },
  
  // Louis Pasteur
  { text: "Chance favors the prepared mind.", author: "Louis Pasteur", year: "1854" },
  { text: "Science knows no country, because knowledge belongs to humanity.", author: "Louis Pasteur" },
  { text: "Let me tell you the secret that has led me to my goal: my strength lies solely in my tenacity.", author: "Louis Pasteur" },
  
  // Charles Darwin
  { text: "It is not the strongest of the species that survives, nor the most intelligent that survives. It is the one that is most adaptable to change.", author: "Charles Darwin", year: "1859" },
  { text: "A man who dares to waste one hour of time has not discovered the value of life.", author: "Charles Darwin" },
  
  // Albert Einstein
  { text: "Imagination is more important than knowledge.", author: "Albert Einstein", year: "1929" },
  { text: "The important thing is not to stop questioning.", author: "Albert Einstein" },
  { text: "Try not to become a man of success, but rather try to become a man of value.", author: "Albert Einstein", year: "1955" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Logic will get you from A to B. Imagination will take you everywhere.", author: "Albert Einstein" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { text: "Life is like riding a bicycle. To keep your balance, you must keep moving.", author: "Albert Einstein", year: "1930" },
  
  // Archimedes
  { text: "Give me a lever long enough and a fulcrum on which to place it, and I shall move the world.", author: "Archimedes", year: "250 BC" },
  { text: "Eureka! I have found it!", author: "Archimedes", year: "250 BC" },
  
  // Johannes Kepler
  { text: "Nature uses as little as possible of anything.", author: "Johannes Kepler", year: "1618" },
  
  // Blaise Pascal
  { text: "All of humanity's problems stem from man's inability to sit quietly in a room alone.", author: "Blaise Pascal", year: "1670" },
  
  // René Descartes
  { text: "I think, therefore I am.", author: "René Descartes", year: "1637" },
  { text: "Divide each difficulty into as many parts as is feasible and necessary to resolve it.", author: "René Descartes" },
  
  // Francis Bacon
  { text: "Knowledge is power.", author: "Francis Bacon", year: "1597" },
  { text: "If a man will begin with certainties, he shall end in doubts; but if he will be content to begin with doubts, he shall end in certainties.", author: "Francis Bacon" },
  
  // Robert Fulton
  { text: "The mechanic should sit down among levers, screws, wedges, wheels, etc., like a poet among the letters of the alphabet, considering them as an exhibition of his thoughts.", author: "Robert Fulton", year: "1810" },
  
  // Samuel Colt
  { text: "There is no such thing as a new idea. We simply take a lot of old ideas and put them into a sort of mental kaleidoscope.", author: "Samuel Colt" },
  
  // Elias Howe
  { text: "The idea came to me in a dream.", author: "Elias Howe", year: "1845" },
  
  // Willis Carrier
  { text: "The world is not interested in the storms you encountered, but whether you brought in the ship.", author: "Willis Carrier" },
  
  // George Pullman
  { text: "I have always held that the man who does the work should have the benefit of it.", author: "George Pullman", year: "1880" },
  
  // Guglielmo Marconi
  { text: "Every day sees humanity more victorious in the struggle with space and time.", author: "Guglielmo Marconi", year: "1909" },
  
  // Rudolf Diesel
  { text: "The fact that some geniuses were laughed at does not imply that all who are laughed at are geniuses.", author: "Rudolf Diesel" },
  
  // Wright Brothers (more)
  { text: "If we worked on the assumption that what is accepted as true really is true, then there would be little hope for advance.", author: "Orville Wright" },
  
  // Philo Farnsworth
  { text: "There is nothing on there worthwhile, and we're not going to watch it in this household, and I don't want it in your intellectual diet.", author: "Philo Farnsworth", year: "1957" },
  
  // Percy Spencer
  { text: "The magnetron tube is the greatest thing since the light bulb.", author: "Percy Spencer", year: "1945" },
  
  // Igor Sikorsky
  { text: "The work of the individual still remains the spark that moves mankind ahead.", author: "Igor Sikorsky" },
  
  // Edwin Land
  { text: "Don't undertake a project unless it is manifestly important and nearly impossible.", author: "Edwin Land", year: "1970" },
  { text: "An essential aspect of creativity is not being afraid to fail.", author: "Edwin Land" },
  
  // Grace Hopper
  { text: "The most dangerous phrase in the language is, 'We've always done it this way.'", author: "Grace Hopper", year: "1986" },
  { text: "A ship in port is safe, but that's not what ships are built for.", author: "Grace Hopper" },
  
  // Hedy Lamarr
  { text: "Improving things is at the heart of my nature.", author: "Hedy Lamarr", year: "1940" },
  
  // Chester Carlson
  { text: "I think we have a good chance of surviving long enough to colonize the solar system.", author: "Chester Carlson" },
  
  // Stephanie Kwolek
  { text: "I hope I have helped to raise the prestige of women scientists.", author: "Stephanie Kwolek", year: "1964" },
  
  // Wallace Carothers
  { text: "Now that I don't have to work for a living, I'm going to have to work for a living.", author: "Wallace Carothers", year: "1928" },
  
  // Lewis Latimer
  { text: "We create our buildings and then they create us.", author: "Lewis Latimer" },
  
  // Garrett Morgan
  { text: "If you can be the best, then why not try to be the best?", author: "Garrett Morgan" },
  
  // Granville Woods
  { text: "I am interested only in the betterment of my race.", author: "Granville Woods" },
  
  // Jan Ernst Matzeliger
  { text: "Nothing is impossible with God.", author: "Jan Ernst Matzeliger", year: "1880" },
  
  // Lonnie Johnson
  { text: "When you're a kid, you think about what you want to be when you grow up. I wanted to be an inventor.", author: "Lonnie Johnson", year: "1990" },
  
  // Patricia Bath
  { text: "The ability to restore sight is the ultimate reward.", author: "Patricia Bath", year: "1988" },
  
  // General Makers/Engineers
  { text: "The engineer has been, and is, a maker of history.", author: "James Kip Finch", year: "1960" },
  { text: "Scientists discover the world that exists; engineers create the world that never was.", author: "Theodore von Kármán", year: "1960" },
  { text: "One person's 'magic' is another person's engineering.", author: "Robert A. Heinlein", year: "1973" },
  { text: "To define is to limit.", author: "Oscar Wilde", year: "1890" },
  { text: "Form follows function.", author: "Louis Sullivan", year: "1896" },
  { text: "Have nothing in your house that you do not know to be useful, or believe to be beautiful.", author: "William Morris", year: "1880" },
  { text: "Good design is as little design as possible.", author: "Dieter Rams", year: "1980" },
  { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Charles Eames", year: "1972" },
  { text: "The details are not the details. They make the design.", author: "Charles Eames" },
  { text: "Take nothing on its looks; take everything on evidence.", author: "Charles Dickens", year: "1861" },
  
  // More historical figures
  { text: "Well done is better than well said.", author: "Benjamin Franklin", year: "1737" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "In the beginner's mind there are many possibilities, in the expert's mind there are few.", author: "Shunryu Suzuki", year: "1970" },
  { text: "The creation of something new is not accomplished by the intellect but by the play instinct.", author: "Carl Jung", year: "1921" },
  { text: "The greatest danger for most of us is not that our aim is too high and we miss it, but that it is too low and we reach it.", author: "Michelangelo", year: "1560" },
  { text: "I saw the angel in the marble and carved until I set him free.", author: "Michelangelo" },

  { text: "Nature is pleased with simplicity.", author: "Isaac Newton" },
  { text: "Make everything as simple as possible, but not simpler.", author: "Albert Einstein", year: "1933" },
  { text: "The more you know, the more you realize you don't know.", author: "Aristotle", year: "350 BC" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", year: "350 BC" },
  { text: "There is no substitute for hard work.", author: "Thomas Edison" },
  { text: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.", author: "Thomas Edison" },
  { text: "I find out what the world needs. Then, I go ahead and invent it.", author: "Thomas Edison" },
  { text: "Opportunity is missed by most people because it is dressed in overalls and looks like work.", author: "Thomas Edison" },
  { text: "Hell, there are no rules here - we're trying to accomplish something.", author: "Thomas Edison", year: "1903" },
  
  // Additional Thomas Edison
  { text: "Restlessness is discontent and discontent is the first necessity of progress.", author: "Thomas Edison" },
  { text: "The three great essentials to achieve anything worthwhile are, first, hard work; second, stick-to-itiveness; third, common sense.", author: "Thomas Edison" },
  { text: "Show me a thoroughly satisfied man and I will show you a failure.", author: "Thomas Edison" },
  { text: "Many of life's failures are people who did not realize how close they were to success when they gave up.", author: "Thomas Edison" },
  { text: "We don't know a millionth of one percent about anything.", author: "Thomas Edison" },
  { text: "Everything comes to him who hustles while he waits.", author: "Thomas Edison" },
  { text: "Non-violence leads to the highest ethics, which is the goal of all evolution.", author: "Thomas Edison" },
  { text: "The doctor of the future will give no medicine, but will interest her or his patients in the care of the human frame.", author: "Thomas Edison" },
  { text: "Results! Why, man, I have gotten a lot of results. I know several thousand things that won't work.", author: "Thomas Edison" },
  { text: "Being busy does not always mean real work.", author: "Thomas Edison" },
  
  // Additional Albert Einstein
  { text: "The only source of knowledge is experience.", author: "Albert Einstein" },
  { text: "I have no special talents. I am only passionately curious.", author: "Albert Einstein" },
  { text: "It's not that I'm so smart, it's just that I stay with problems longer.", author: "Albert Einstein" },
  { text: "The true sign of intelligence is not knowledge but imagination.", author: "Albert Einstein" },
  { text: "We cannot solve our problems with the same thinking we used when we created them.", author: "Albert Einstein" },
  { text: "Anyone who has never made a mistake has never tried anything new.", author: "Albert Einstein" },
  { text: "The world as we have created it is a process of our thinking.", author: "Albert Einstein" },
  { text: "Weakness of attitude becomes weakness of character.", author: "Albert Einstein" },
  { text: "Learn from yesterday, live for today, hope for tomorrow.", author: "Albert Einstein" },
  { text: "Look deep into nature, and then you will understand everything better.", author: "Albert Einstein" },
  { text: "The measure of intelligence is the ability to change.", author: "Albert Einstein" },
  { text: "Any fool can know. The point is to understand.", author: "Albert Einstein" },
  { text: "Once we accept our limits, we go beyond them.", author: "Albert Einstein" },
  { text: "Pure mathematics is, in its way, the poetry of logical ideas.", author: "Albert Einstein", year: "1950" },
  { text: "Science without religion is lame, religion without science is blind.", author: "Albert Einstein", year: "1941" },
  
  // Additional Leonardo da Vinci
  { text: "Where the spirit does not work with the hand, there is no art.", author: "Leonardo da Vinci" },
  { text: "Poor is the pupil who does not surpass his master.", author: "Leonardo da Vinci" },
  { text: "It had long since come to my attention that people of accomplishment rarely sat back and let things happen to them.", author: "Leonardo da Vinci" },
  { text: "Nothing strengthens authority so much as silence.", author: "Leonardo da Vinci" },
  { text: "The smallest feline is a masterpiece.", author: "Leonardo da Vinci" },
  { text: "Iron rusts from disuse; water loses its purity from stagnation... even so does inaction sap the vigor of the mind.", author: "Leonardo da Vinci" },
  { text: "There are three classes of people: those who see, those who see when they are shown, those who do not see.", author: "Leonardo da Vinci" },
  { text: "Time stays long enough for anyone who will use it.", author: "Leonardo da Vinci" },
  { text: "Realize that everything connects to everything else.", author: "Leonardo da Vinci" },
  { text: "The human foot is a masterpiece of engineering and a work of art.", author: "Leonardo da Vinci" },
  { text: "Nature never breaks her own laws.", author: "Leonardo da Vinci" },
  { text: "Study without desire spoils the memory.", author: "Leonardo da Vinci" },
  { text: "Details make perfection, and perfection is not a detail.", author: "Leonardo da Vinci" },
  { text: "He who loves practice without theory is like the sailor who boards ship without a rudder.", author: "Leonardo da Vinci" },
  { text: "Obstacles cannot crush me. Every obstacle yields to stern resolve.", author: "Leonardo da Vinci" },
  
  // Additional Nikola Tesla
  { text: "I do not think there is any thrill that can go through the human heart like that felt by the inventor.", author: "Nikola Tesla" },
  { text: "Let the future tell the truth, and evaluate each one according to his work and accomplishments.", author: "Nikola Tesla" },
  { text: "What one man calls God, another calls the laws of physics.", author: "Nikola Tesla" },
  { text: "Our virtues and our failings are inseparable, like force and matter.", author: "Nikola Tesla" },
  { text: "Of all things, I liked books best.", author: "Nikola Tesla" },
  { text: "The scientists of today think deeply instead of clearly.", author: "Nikola Tesla" },
  { text: "Today's scientists have substituted mathematics for experiments.", author: "Nikola Tesla" },
  { text: "Life is and will ever remain an equation incapable of solution.", author: "Nikola Tesla" },
  { text: "My brain is only a receiver, in the Universe there is a core from which we obtain knowledge.", author: "Nikola Tesla" },
  { text: "Invention is the most important product of man's creative brain.", author: "Nikola Tesla" },
  { text: "If your hate could be turned into electricity, it would light up the whole world.", author: "Nikola Tesla" },
  { text: "We crave for new sensations but soon become indifferent to them.", author: "Nikola Tesla" },
  { text: "Most persons are so absorbed in the contemplation of the outside world that they are wholly oblivious to what is passing on within themselves.", author: "Nikola Tesla" },
  { text: "The gift of mental power comes from God, and if we concentrate our minds on that truth, we become in tune with this great power.", author: "Nikola Tesla" },
  { text: "Alpha waves in the human brain are between 6 and 8 hertz. The wave frequency of the human cavity resonates between 6 and 8 hertz.", author: "Nikola Tesla" },
  
  // Additional Benjamin Franklin
  { text: "By failing to prepare, you are preparing to fail.", author: "Benjamin Franklin" },
  { text: "Diligence is the mother of good luck.", author: "Benjamin Franklin" },
  { text: "Never confuse motion with action.", author: "Benjamin Franklin" },
  { text: "If you would not be forgotten, as soon as you are dead and rotten, either write things worth reading, or do things worth writing.", author: "Benjamin Franklin" },
  { text: "Do not fear mistakes. You will know failure. Continue to reach out.", author: "Benjamin Franklin" },
  { text: "Lost time is never found again.", author: "Benjamin Franklin" },
  { text: "In this world nothing can be said to be certain, except death and taxes.", author: "Benjamin Franklin", year: "1789" },
  { text: "I didn't fail the test. I just found 100 ways to do it wrong.", author: "Benjamin Franklin" },
  { text: "Early to bed and early to rise makes a man healthy, wealthy and wise.", author: "Benjamin Franklin", year: "1735" },
  { text: "Hide not your talents. They for use were made.", author: "Benjamin Franklin" },
  { text: "Beware of little expenses. A small leak will sink a great ship.", author: "Benjamin Franklin" },
  { text: "When you're finished changing, you're finished.", author: "Benjamin Franklin" },
  { text: "Time is money.", author: "Benjamin Franklin", year: "1748" },
  { text: "Wealth is not his that has it, but his that enjoys it.", author: "Benjamin Franklin" },
  { text: "Genius without education is like silver in the mine.", author: "Benjamin Franklin" },
  
  // Additional Henry Ford
  { text: "Nothing is particularly hard if you divide it into small jobs.", author: "Henry Ford" },
  { text: "Obstacles are those frightful things you see when you take your eyes off your goal.", author: "Henry Ford" },
  { text: "Don't find fault, find a remedy.", author: "Henry Ford" },
  { text: "If everyone is moving forward together, then success takes care of itself.", author: "Henry Ford" },
  { text: "Vision without execution is just hallucination.", author: "Henry Ford" },
  { text: "The only real mistake is the one from which we learn nothing.", author: "Henry Ford" },
  { text: "You can't build a reputation on what you are going to do.", author: "Henry Ford" },
  { text: "Most people spend more time and energy going around problems than in trying to solve them.", author: "Henry Ford" },
  { text: "Thinking is the hardest work there is, which is probably the reason why so few engage in it.", author: "Henry Ford" },
  { text: "Life is a series of experiences, each one of which makes us bigger.", author: "Henry Ford" },
  { text: "When everything seems to be going against you, remember that the airplane takes off against the wind, not with it.", author: "Henry Ford" },
  { text: "The whole secret of a successful life is to find out what is one's destiny to do, and then do it.", author: "Henry Ford" },
  { text: "There is no man living who isn't capable of doing more than he thinks he can do.", author: "Henry Ford" },
  { text: "Even a mistake may turn out to be the one thing necessary to a worthwhile achievement.", author: "Henry Ford" },
  { text: "A business that makes nothing but money is a poor business.", author: "Henry Ford" },
  
  // Additional Marie Curie
  { text: "I am among those who think that science has great beauty.", author: "Marie Curie" },
  { text: "We must have perseverance and above all confidence in ourselves.", author: "Marie Curie" },
  { text: "We must believe that we are gifted for something and that this thing must be attained.", author: "Marie Curie" },
  { text: "Life is not easy for any of us. But what of that? We must have perseverance and above all confidence in ourselves.", author: "Marie Curie" },
  { text: "You cannot hope to build a better world without improving the individuals.", author: "Marie Curie" },
  { text: "A scientist in his laboratory is not a mere technician: he is also a child confronting natural phenomena.", author: "Marie Curie" },
  { text: "I have frequently been questioned, especially by women, of how I could reconcile family life with a scientific career.", author: "Marie Curie" },
  { text: "Humanity needs practical men, who get the most out of their work, and, without forgetting the general good.", author: "Marie Curie" },
  { text: "All my life through, the new sights of Nature made me rejoice like a child.", author: "Marie Curie" },
  { text: "First principle: never to let one's self be beaten down by persons or by events.", author: "Marie Curie" },
  
  // Additional Isaac Newton
  { text: "Tact is the knack of making a point without making an enemy.", author: "Isaac Newton" },
  { text: "What we know is a drop, what we don't know is an ocean.", author: "Isaac Newton" },
  { text: "Plato is my friend, Aristotle is my friend, but my greatest friend is truth.", author: "Isaac Newton" },
  { text: "If I have ever made any valuable discoveries, it has been due more to patient attention, than to any other talent.", author: "Isaac Newton" },

  { text: "Errors are not in the art but in the artificers.", author: "Isaac Newton" },
  { text: "Build we must, for our future is one that we shall have to build.", author: "Isaac Newton" },
  { text: "No great discovery was ever made without a bold guess.", author: "Isaac Newton" },
  { text: "A man may imagine things that are false, but he can only understand things that are true.", author: "Isaac Newton" },
  { text: "Nature is exceedingly simple and harmonious with itself.", author: "Isaac Newton" },
  
  // Galileo Galilei (more)
  { text: "You cannot teach a man anything; you can only help him discover it in himself.", author: "Galileo Galilei" },
  { text: "In questions of science, the authority of a thousand is not worth the humble reasoning of a single individual.", author: "Galileo Galilei" },
  { text: "The sun is new each day.", author: "Galileo Galilei" },
  { text: "By denying scientific principles, one may maintain any paradox.", author: "Galileo Galilei" },
  { text: "I do not feel obliged to believe that the same God who has endowed us with sense, reason, and intellect has intended us to forgo their use.", author: "Galileo Galilei" },
  { text: "Mathematics is the language with which God has written the universe.", author: "Galileo Galilei" },
  { text: "Where the senses fail us, reason must step in.", author: "Galileo Galilei" },
  { text: "We cannot teach people anything; we can only help them discover it within themselves.", author: "Galileo Galilei" },
  { text: "Nature is relentless and unchangeable.", author: "Galileo Galilei" },
  { text: "Facts which at first seem improbable will, even on scant explanation, drop the cloak which has hidden them.", author: "Galileo Galilei" },
  
  // Aristotle (more)
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "It is the mark of an educated mind to be able to entertain a thought without accepting it.", author: "Aristotle" },
  { text: "The whole is greater than the sum of its parts.", author: "Aristotle" },
  { text: "Patience is bitter, but its fruit is sweet.", author: "Aristotle" },
  { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { text: "The aim of art is to represent not the outward appearance of things, but their inward significance.", author: "Aristotle" },
  { text: "There is no great genius without some touch of madness.", author: "Aristotle" },
  { text: "Hope is a waking dream.", author: "Aristotle" },
  { text: "The educated differ from the uneducated as much as the living differ from the dead.", author: "Aristotle" },
  { text: "The one exclusive sign of thorough knowledge is the power of teaching.", author: "Aristotle" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act but a habit.", author: "Aristotle" },
  { text: "He who has overcome his fears will truly be free.", author: "Aristotle" },
  { text: "Pleasure in the job puts perfection in the work.", author: "Aristotle" },
  { text: "The energy of the mind is the essence of life.", author: "Aristotle" },
  
  // Plato
  { text: "The beginning is the most important part of the work.", author: "Plato", year: "380 BC" },
  { text: "Necessity is the mother of invention.", author: "Plato", year: "380 BC" },
  { text: "A good decision is based on knowledge and not on numbers.", author: "Plato" },
  { text: "We can easily forgive a child who is afraid of the dark; the real tragedy of life is when men are afraid of the light.", author: "Plato" },
  { text: "The measure of a man is what he does with power.", author: "Plato" },
  { text: "Wise men speak because they have something to say; fools because they have to say something.", author: "Plato" },
  { text: "Opinion is the medium between knowledge and ignorance.", author: "Plato" },
  { text: "Geometry will draw the soul toward truth.", author: "Plato" },
  { text: "The direction in which education starts a man will determine his future in life.", author: "Plato" },
  { text: "Good actions give strength to ourselves and inspire good actions in others.", author: "Plato" },
  { text: "The first and greatest victory is to conquer yourself.", author: "Plato" },
  { text: "At the touch of love everyone becomes a poet.", author: "Plato" },
  { text: "Excellence is not a gift, but a skill that takes practice.", author: "Plato" },
  { text: "A hero is born among a hundred, a wise man is found among a thousand.", author: "Plato" },
  { text: "The price good men pay for indifference to public affairs is to be ruled by evil men.", author: "Plato" },
  
  // Socrates
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", year: "400 BC" },
  { text: "An unexamined life is not worth living.", author: "Socrates", year: "399 BC" },
  { text: "Wonder is the beginning of wisdom.", author: "Socrates" },
  { text: "I cannot teach anybody anything. I can only make them think.", author: "Socrates" },
  { text: "To find yourself, think for yourself.", author: "Socrates" },
  { text: "He who is not contented with what he has, would not be contented with what he would like to have.", author: "Socrates" },
  { text: "Be kind, for everyone you meet is fighting a hard battle.", author: "Socrates" },
  { text: "The secret of change is to focus all of your energy not on fighting the old, but on building the new.", author: "Socrates" },
  { text: "Strong minds discuss ideas, average minds discuss events, weak minds discuss people.", author: "Socrates" },
  { text: "True knowledge exists in knowing that you know nothing.", author: "Socrates" },
  { text: "The only good is knowledge and the only evil is ignorance.", author: "Socrates" },
  { text: "By all means, marry. If you get a good wife, you'll become happy; if you get a bad one, you'll become a philosopher.", author: "Socrates" },
  { text: "Let him who would move the world first move himself.", author: "Socrates" },
  { text: "Beware the barrenness of a busy life.", author: "Socrates" },
  { text: "Nature has given us two ears, two eyes, and but one tongue, to the end that we should hear and see more than we speak.", author: "Socrates" },
  
  // Confucius
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", year: "500 BC" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius" },
  { text: "Real knowledge is to know the extent of one's ignorance.", author: "Confucius" },
  { text: "When it is obvious that the goals cannot be reached, don't adjust the goals, adjust the action steps.", author: "Confucius" },
  { text: "The will to win, the desire to succeed, the urge to reach your full potential... these are the keys that will unlock the door to personal excellence.", author: "Confucius" },
  { text: "I hear and I forget. I see and I remember. I do and I understand.", author: "Confucius" },
  { text: "Study the past if you would define the future.", author: "Confucius" },
  { text: "Everything has beauty, but not everyone sees it.", author: "Confucius" },
  { text: "Choose a job you love, and you will never have to work a day in your life.", author: "Confucius" },
  { text: "The superior man is modest in his speech, but exceeds in his actions.", author: "Confucius" },
  { text: "To see what is right and not do it is a lack of courage.", author: "Confucius" },
  { text: "Faced with what is right, to leave it undone shows a lack of courage.", author: "Confucius" },
  { text: "The funniest people are the saddest ones.", author: "Confucius" },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
  
  // Lao Tzu
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu", year: "600 BC" },
  { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" },
  { text: "He who knows others is wise; he who knows himself is enlightened.", author: "Lao Tzu" },
  { text: "When I let go of what I am, I become what I might be.", author: "Lao Tzu" },
  { text: "Do the difficult things while they are easy and do the great things while they are small.", author: "Lao Tzu" },
  { text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.", author: "Lao Tzu" },
  { text: "Mastering others is strength. Mastering yourself is true power.", author: "Lao Tzu" },
  { text: "To the mind that is still, the whole universe surrenders.", author: "Lao Tzu" },
  { text: "If you do not change direction, you may end up where you are heading.", author: "Lao Tzu" },
  { text: "Great acts are made up of small deeds.", author: "Lao Tzu" },
  { text: "He who conquers himself is the mightiest warrior.", author: "Lao Tzu" },
  { text: "Knowing others is intelligence; knowing yourself is true wisdom.", author: "Lao Tzu" },
  { text: "Care about what other people think and you will always be their prisoner.", author: "Lao Tzu" },
  { text: "The wise man is one who knows what he does not know.", author: "Lao Tzu" },
  { text: "A good traveler has no fixed plans and is not intent on arriving.", author: "Lao Tzu" },
  
  // More Michelangelo
  { text: "The greater danger for most of us lies not in setting our aim too high and falling short; but in setting our aim too low, and achieving our mark.", author: "Michelangelo" },
  { text: "Every block of stone has a statue inside it and it is the task of the sculptor to discover it.", author: "Michelangelo" },
  { text: "Genius is eternal patience.", author: "Michelangelo" },
  { text: "If people knew how hard I had to work to gain my mastery, it would not seem so wonderful at all.", author: "Michelangelo" },
  { text: "The true work of art is but a shadow of the divine perfection.", author: "Michelangelo" },
  { text: "Lord, grant that I may always desire more than I can accomplish.", author: "Michelangelo" },
  { text: "There is no greater harm than that of time wasted.", author: "Michelangelo" },
  { text: "Trifles make perfection, and perfection is no trifle.", author: "Michelangelo" },
  { text: "Faith in oneself is the best and safest course.", author: "Michelangelo" },
  { text: "Critique by creating.", author: "Michelangelo" },
  
  // More Buckminster Fuller
  { text: "If you want to teach people a new way of thinking, don't bother trying to teach them. Instead, give them a tool, the use of which will lead to new ways of thinking.", author: "Buckminster Fuller" },
  { text: "Dare to be naive.", author: "Buckminster Fuller" },
  { text: "Don't fight forces, use them.", author: "Buckminster Fuller" },
  { text: "We are called to be architects of the future, not its victims.", author: "Buckminster Fuller" },
  { text: "You can never learn less, you can only learn more.", author: "Buckminster Fuller" },
  { text: "There is nothing in a caterpillar that tells you it's going to be a butterfly.", author: "Buckminster Fuller" },
  { text: "Humanity is acquiring all the right technology for all the wrong reasons.", author: "Buckminster Fuller" },
  { text: "Love is metaphysical gravity.", author: "Buckminster Fuller" },
  { text: "Pollution is nothing but the resources we are not harvesting.", author: "Buckminster Fuller" },
  { text: "We are not going to be able to operate our Spaceship Earth successfully nor for much longer unless we see it as a whole spaceship.", author: "Buckminster Fuller", year: "1969" },
  
  // More Charles Kettering
  { text: "People think of the inventor as a screwball, but no one ever asks the inventor what he thinks of other people.", author: "Charles Kettering" },
  { text: "You will never stub your toe standing still. The faster you go, the more chance there is of stubbing your toe.", author: "Charles Kettering" },
  { text: "My interest is in the future because I am going to spend the rest of my life there.", author: "Charles Kettering" },
  { text: "High achievement always takes place in the framework of high expectation.", author: "Charles Kettering" },
  { text: "It is not a disgrace to fail. Failing is one of the greatest arts in the world.", author: "Charles Kettering" },
  { text: "Where there is an open mind, there will always be a frontier.", author: "Charles Kettering" },
  { text: "Nothing ever built arose to touch the skies unless some man dreamed that it should, some man believed that it could, and some man willed that it must.", author: "Charles Kettering" },
  { text: "The opportunities of man are limited only by his imagination. But so few have imagination that there are ten thousand fiddlers to one composer.", author: "Charles Kettering" },
  { text: "We need to teach the highly educated man that it is not a disgrace to fail and that he must analyze every failure to find its cause.", author: "Charles Kettering" },
  { text: "The difference between intelligence and education is this: intelligence will make you a good living.", author: "Charles Kettering" },
  
  // More Louis Pasteur
  { text: "In the fields of observation chance favors only the prepared mind.", author: "Louis Pasteur" },
  { text: "Fortune favors the prepared mind.", author: "Louis Pasteur" },
  { text: "Did you ever observe to whom the accidents happen? Chance favors only the prepared mind.", author: "Louis Pasteur" },
  { text: "I am utterly convinced that Science and Peace will triumph over Ignorance and War.", author: "Louis Pasteur" },
  { text: "There does not exist a category of science to which one can give the name applied science.", author: "Louis Pasteur" },
  { text: "Wine is the most healthful and most hygienic of beverages.", author: "Louis Pasteur" },
  { text: "When I approach a child, he inspires in me two sentiments; tenderness for what he is, and respect for what he may become.", author: "Louis Pasteur" },
  { text: "One does not ask of one who suffers: What is your country and what is your religion?", author: "Louis Pasteur" },
  { text: "To know how to wonder and question is the first step of the mind toward discovery.", author: "Louis Pasteur" },
  { text: "Work cures everything.", author: "Louis Pasteur" },
  
  // More Charles Darwin
  { text: "In the long history of humankind, those who learned to collaborate and improvise most effectively have prevailed.", author: "Charles Darwin" },
  { text: "It is not the strongest species that survive, nor the most intelligent, but the most responsive to change.", author: "Charles Darwin" },
  { text: "Ignorance more frequently begets confidence than does knowledge.", author: "Charles Darwin", year: "1871" },
  { text: "A mathematician is a blind man in a dark room looking for a black cat which isn't there.", author: "Charles Darwin" },
  { text: "An American monkey, after getting drunk on brandy, would never touch it again, and thus is much wiser than most men.", author: "Charles Darwin" },
  { text: "The very essence of instinct is that it's followed independently of reason.", author: "Charles Darwin" },
  { text: "If I had my life to live over again, I would have made a rule to read some poetry and listen to some music at least once every week.", author: "Charles Darwin" },
  { text: "The highest possible stage in moral culture is when we recognize that we ought to control our thoughts.", author: "Charles Darwin" },
  { text: "False facts are highly injurious to the progress of science.", author: "Charles Darwin" },
  { text: "We must, however, acknowledge, as it seems to me, that man with all his noble qualities still bears in his bodily frame the indelible stamp of his lowly origin.", author: "Charles Darwin", year: "1871" },
  
  // More George Washington Carver
  { text: "It is not the style of clothes one wears, neither the kind of automobile one drives, nor the amount of money one has in the bank, that counts.", author: "George Washington Carver" },
  { text: "How far you go in life depends on your being tender with the young, compassionate with the aged, sympathetic with the striving and tolerant of the weak and strong.", author: "George Washington Carver" },
  { text: "Ninety-nine percent of the failures come from people who have the habit of making excuses.", author: "George Washington Carver" },
  { text: "Reading about nature is fine, but if a person walks in the woods and listens carefully, he can learn more than what is in books.", author: "George Washington Carver" },
  { text: "I love to think of nature as an unlimited broadcasting station, through which God speaks to us every hour, if we will only tune in.", author: "George Washington Carver" },
  { text: "Nothing is more beautiful than the loveliness of the woods before sunrise.", author: "George Washington Carver" },
  { text: "Since new developments are the products of a creative mind, we must therefore stimulate and encourage that type of mind in every way possible.", author: "George Washington Carver" },
  { text: "All my life I have risen regularly at four o'clock and have gone into the woods and talked to God.", author: "George Washington Carver" },
  { text: "Anything will give up its secrets if you love it enough.", author: "George Washington Carver" },
  { text: "There is a use for almost everything.", author: "George Washington Carver" },
  
  // More Wright Brothers and Aviation Pioneers
  { text: "The airplane stays up because it doesn't have the time to fall.", author: "Orville Wright" },
  { text: "No flying machine will ever fly from New York to Paris.", author: "Orville Wright", year: "1908" },
  { text: "We could hardly wait to get up in the morning.", author: "Wilbur Wright" },
  { text: "The exhilaration of flying is too keen, the pleasure too great, for it to be neglected as a sport.", author: "Orville Wright" },
  
  // More Alexander Graham Bell
  { text: "Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell" },
  { text: "Great discoveries and improvements invariably involve the cooperation of many minds.", author: "Alexander Graham Bell" },
  { text: "What this power is I cannot say; all I know is that it exists and it becomes available only when a man is in that state of mind in which he knows exactly what he wants and is fully determined not to quit until he finds it.", author: "Alexander Graham Bell" },
  { text: "Sometimes we stare so long at a door that is closing that we see too late the one that is open.", author: "Alexander Graham Bell" },
  { text: "America is a country of inventors, and the greatest of inventors are the newspaper men.", author: "Alexander Graham Bell" },
  
  // Samuel F.B. Morse
  { text: "The mere holding of slaves is one of the most perplexing and painful duties of the Christian.", author: "Samuel Morse", year: "1835" },
  { text: "If the presence of electricity can be made visible in any part of the circuit, I see no reason why intelligence may not be transmitted instantaneously by electricity.", author: "Samuel Morse", year: "1832" },
  
  // Guglielmo Marconi (more)
  { text: "Have I done the world good, or have I added a menace?", author: "Guglielmo Marconi", year: "1912" },
  { text: "It is dangerous to put limits to new discoveries.", author: "Guglielmo Marconi" },
  
  // More James Watt
  { text: "I had gone to take a walk on a fine Sabbath afternoon. I entered the Green by the gate at the foot of Charlotte Street and had passed the old washing-house. I was thinking upon the engine at the time.", author: "James Watt", year: "1765" },
  
  // Eli Whitney (more)
  { text: "One of my primary objects is to form the tools so the tools themselves shall fashion the work.", author: "Eli Whitney", year: "1799" },
  
  // More Rudolf Diesel
  { text: "I am convinced that this engine will be of great importance for small and medium-sized industries.", author: "Rudolf Diesel", year: "1892" },
  { text: "The diesel engine can be fed with vegetable oils and would help considerably in the development of agriculture.", author: "Rudolf Diesel", year: "1912" },
  
  // More Grace Hopper
  { text: "To me programming is more than an important practical art. It is also a gigantic undertaking in the foundations of knowledge.", author: "Grace Hopper", year: "1952" },
  { text: "Humans are allergic to change. They love to say, 'We've always done it this way.'", author: "Grace Hopper" },
  { text: "The glass is neither half empty nor half full. It's simply larger than it needs to be.", author: "Grace Hopper" },
  { text: "I've always been more interested in the future than in the past.", author: "Grace Hopper" },
  { text: "If it's a good idea, go ahead and do it. It's much easier to apologize than it is to get permission.", author: "Grace Hopper" },
  { text: "You manage things; you lead people.", author: "Grace Hopper" },
  { text: "Life was simple before World War II. After that, we had systems.", author: "Grace Hopper" },
  
  // More Hedy Lamarr
  { text: "Any girl can be glamorous. All you have to do is stand still and look stupid.", author: "Hedy Lamarr", year: "1966" },
  { text: "I have not been that wise. Health I have taken for granted. Love I have demanded, perhaps too much and too often.", author: "Hedy Lamarr" },
  
  // More Edwin Land
  { text: "Science is a method of investigating nature, a way of knowing about nature, that discovers reliable knowledge about it.", author: "Edwin Land" },
  { text: "The bottom line is in heaven.", author: "Edwin Land", year: "1944" },
  { text: "If you dream of something worth doing and then simply go to work on it and don't think anything of personalities, you will almost surely succeed.", author: "Edwin Land" },
  { text: "Any problem can be solved using the materials in the room.", author: "Edwin Land" },
  { text: "We can be dramatic, even theatrical; we can be persuasive; but the message we are telling must be true.", author: "Edwin Land" },
  
  // More Igor Sikorsky
  { text: "According to the laws of aerodynamics, the bumblebee can't fly either, but the bumblebee doesn't know anything about the laws of aerodynamics, so it goes ahead and flies anyway.", author: "Igor Sikorsky" },
  { text: "The helicopter is probably the most versatile instrument ever invented by man.", author: "Igor Sikorsky" },
  { text: "If you are in trouble anywhere in the world, an airplane can fly over and drop flowers, but a helicopter can land and save your life.", author: "Igor Sikorsky" },
  
  // Willis Carrier (more)
  { text: "I fish only for edible fish, and hunt only for edible game, even in the laboratory.", author: "Willis Carrier" },
  
  // More Philo Farnsworth
  { text: "I know why I'm here. I know what the potential is. I believe in it.", author: "Philo Farnsworth", year: "1957" },
  
  // Johannes Kepler (more)
  { text: "I demonstrate by means of philosophy that the earth is round, and is inhabited on all sides.", author: "Johannes Kepler", year: "1611" },
  { text: "Geometry has two great treasures: one is the Theorem of Pythagoras; the other, the division of a line into extreme and mean ratio.", author: "Johannes Kepler" },
  { text: "Truth is the daughter of time, and I feel no shame in being her midwife.", author: "Johannes Kepler", year: "1609" },
  { text: "We do not ask for what useful purpose the birds do sing, for song is their pleasure since they were created for singing.", author: "Johannes Kepler" },
  
  // More Blaise Pascal
  { text: "The heart has its reasons which reason knows not.", author: "Blaise Pascal", year: "1670" },
  { text: "Kind words do not cost much. Yet they accomplish much.", author: "Blaise Pascal" },
  { text: "Man is equally incapable of seeing the nothingness from which he emerges and the infinity in which he is engulfed.", author: "Blaise Pascal" },
  { text: "We know the truth, not only by the reason, but also by the heart.", author: "Blaise Pascal" },
  { text: "Small minds are concerned with the extraordinary, great minds with the ordinary.", author: "Blaise Pascal" },
  { text: "The least movement is of importance to all nature. The entire ocean is affected by a pebble.", author: "Blaise Pascal" },
  { text: "I have made this letter longer than usual, only because I have not had the time to make it shorter.", author: "Blaise Pascal", year: "1657" },
  
  // More René Descartes
  { text: "The reading of all good books is like a conversation with the finest minds of past centuries.", author: "René Descartes" },
  { text: "It is not enough to have a good mind; the main thing is to use it well.", author: "René Descartes" },
  { text: "Perfect numbers like perfect men are very rare.", author: "René Descartes" },
  { text: "Doubt is the origin of wisdom.", author: "René Descartes" },
  { text: "The greatest minds are capable of the greatest vices as well as of the greatest virtues.", author: "René Descartes" },
  { text: "Each problem that I solved became a rule which served afterwards to solve other problems.", author: "René Descartes", year: "1637" },
  { text: "To live without philosophizing is in truth the same as keeping the eyes closed without attempting to open them.", author: "René Descartes" },
  { text: "Everything is self-evident.", author: "René Descartes" },
  
  // More Francis Bacon
  { text: "Some books are to be tasted, others to be swallowed, and some few to be chewed and digested.", author: "Francis Bacon", year: "1625" },
  { text: "In order for the light to shine so brightly, the darkness must be present.", author: "Francis Bacon" },
  { text: "A wise man will make more opportunities than he finds.", author: "Francis Bacon" },
  { text: "Nature, to be commanded, must be obeyed.", author: "Francis Bacon", year: "1620" },
  { text: "There is no excellent beauty that hath not some strangeness in the proportion.", author: "Francis Bacon" },
  { text: "Read not to contradict and confute; nor to believe and take for granted; but to weigh and consider.", author: "Francis Bacon" },
  { text: "Money is like muck, not good except it be spread.", author: "Francis Bacon" },
  { text: "Hope is a good breakfast, but it is a bad supper.", author: "Francis Bacon" },
  { text: "Fortitude is the marshal of thought, the armor of the will, and the fort of reason.", author: "Francis Bacon" },
  { text: "Truth is so hard to tell, it sometimes needs fiction to make it plausible.", author: "Francis Bacon" },
  
  // More Archimedes
  { text: "The shortest distance between two points is a straight line.", author: "Archimedes", year: "250 BC" },
  { text: "There are things which seem incredible to most men who have not studied mathematics.", author: "Archimedes" },
  { text: "The whole is more than the sum of its parts.", author: "Archimedes" },
  
  // Robert Fulton (more)
  { text: "The fear of women is the basis of good health.", author: "Robert Fulton", year: "1806" },
  { text: "Improve on what has gone before, and replace what can be improved.", author: "Robert Fulton" },
  
  // Samuel Colt (more)
  { text: "There is a time in the life of every problem when it is big enough to see, yet small enough to solve.", author: "Samuel Colt" },
  
  // More Oscar Wilde
  { text: "Experience is simply the name we give our mistakes.", author: "Oscar Wilde", year: "1890" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "I can resist everything except temptation.", author: "Oscar Wilde", year: "1890" },
  { text: "We are all in the gutter, but some of us are looking at the stars.", author: "Oscar Wilde", year: "1892" },
  { text: "The truth is rarely pure and never simple.", author: "Oscar Wilde", year: "1895" },
  { text: "Always forgive your enemies; nothing annoys them so much.", author: "Oscar Wilde" },
  { text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde" },
  { text: "Anyone who lives within their means suffers from a lack of imagination.", author: "Oscar Wilde" },
  { text: "A cynic is a man who knows the price of everything and the value of nothing.", author: "Oscar Wilde", year: "1890" },
  { text: "Life is too important to be taken seriously.", author: "Oscar Wilde" },
  
  // William Morris (more)
  { text: "If you want a golden rule that will fit everything, this is it: Have nothing in your houses that you do not know to be useful or believe to be beautiful.", author: "William Morris", year: "1880" },
  { text: "The past is not dead, it is living in us, and will be alive in the future which we are now helping to make.", author: "William Morris" },
  { text: "I do not want art for a few, any more than education for a few, or freedom for a few.", author: "William Morris" },
  
  // More Louis Sullivan
  { text: "An architect is a person who builds homes or structures for people to live or work in.", author: "Louis Sullivan" },
  { text: "It is the pervading law of all things organic and inorganic, of all things physical and metaphysical.", author: "Louis Sullivan", year: "1896" },
  
  // More Charles Eames
  { text: "Eventually everything connects.", author: "Charles Eames" },
  { text: "Recognizing the need is the primary condition for design.", author: "Charles Eames" },
  { text: "Who would say that pleasure has to be useful?", author: "Charles Eames" },
  { text: "Art resides in the quality of doing, process is not magic.", author: "Charles Eames" },
  { text: "Choose your corner, pick away at it carefully, intensely and to the best of your ability and that way you might change the world.", author: "Charles Eames" },
  
  // Dieter Rams (more)
  { text: "Less, but better.", author: "Dieter Rams", year: "1980" },
  { text: "Indifference towards people and the reality in which they live is actually the one and only cardinal sin in design.", author: "Dieter Rams" },
  { text: "Good design is innovative.", author: "Dieter Rams", year: "1976" },
  { text: "Good design makes a product useful.", author: "Dieter Rams" },
  { text: "Good design is aesthetic.", author: "Dieter Rams" },
  { text: "Good design is unobtrusive.", author: "Dieter Rams" },
  { text: "Good design is honest.", author: "Dieter Rams" },
  { text: "Good design is long-lasting.", author: "Dieter Rams" },
  { text: "Good design is thorough down to the last detail.", author: "Dieter Rams" },
  { text: "Good design is environmentally friendly.", author: "Dieter Rams" },
  
  // More Carl Jung
  { text: "Who looks outside, dreams; who looks inside, awakes.", author: "Carl Jung", year: "1916" },
  { text: "Thinking is difficult, that's why most people judge.", author: "Carl Jung" },
  { text: "I am not what happened to me, I am what I choose to become.", author: "Carl Jung" },
  { text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.", author: "Carl Jung" },
  { text: "The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed.", author: "Carl Jung" },
  { text: "Everything that irritates us about others can lead us to an understanding of ourselves.", author: "Carl Jung" },
  { text: "The privilege of a lifetime is to become who you truly are.", author: "Carl Jung" },
  { text: "Mistakes are, after all, the foundations of truth.", author: "Carl Jung" },
  { text: "Your visions will become clear only when you can look into your own heart.", author: "Carl Jung" },
  { text: "The shoe that fits one person pinches another; there is no recipe for living that suits all cases.", author: "Carl Jung" },
  
  // Shunryu Suzuki (more)
  { text: "When you do something, you should burn yourself completely, like a good bonfire, leaving no trace of yourself.", author: "Shunryu Suzuki", year: "1970" },
  { text: "Each of you is perfect the way you are, and you can use a little improvement.", author: "Shunryu Suzuki" },
  { text: "The more you understand, the more you love; the more you love, the more you understand.", author: "Shunryu Suzuki" },
  { text: "Whereever you are, you are one with the clouds and one with the sun and the stars you see.", author: "Shunryu Suzuki" },
  { text: "Without accepting the fact that everything changes, we cannot find perfect composure.", author: "Shunryu Suzuki" },
  
  // More Charles Dickens
  { text: "It was the best of times, it was the worst of times.", author: "Charles Dickens", year: "1859" },
  { text: "No one is useless in this world who lightens the burdens of another.", author: "Charles Dickens" },
  { text: "Have a heart that never hardens, and a temper that never tires, and a touch that never hurts.", author: "Charles Dickens" },
  { text: "The pain of parting is nothing to the joy of meeting again.", author: "Charles Dickens", year: "1844" },
  { text: "There is nothing in the world so irresistibly contagious as laughter and good humor.", author: "Charles Dickens", year: "1843" },
  
  // More Robert A. Heinlein
  { text: "A human being should be able to change a diaper, plan an invasion, butcher a hog, design a building, write a sonnet, set a bone, comfort the dying, take orders, give orders, cooperate, act alone, solve equations, analyze a new problem, pitch manure, program a computer, cook a tasty meal, fight efficiently, die gallantly. Specialization is for insects.", author: "Robert A. Heinlein", year: "1973" },
  { text: "Progress isn't made by early risers. It's made by lazy men trying to find easier ways to do something.", author: "Robert A. Heinlein", year: "1947" },
  { text: "Never underestimate the power of human stupidity.", author: "Robert A. Heinlein" },
  { text: "When one teaches, two learn.", author: "Robert A. Heinlein" },
  { text: "You can have peace. Or you can have freedom. Don't ever count on having both at once.", author: "Robert A. Heinlein", year: "1966" },
  
  // Theodore von Kármán (more)
  { text: "Everyone knows what a curve is, until he has studied enough mathematics to become confused.", author: "Theodore von Kármán" },
  { text: "The scientist describes what is; the engineer creates what never was.", author: "Theodore von Kármán" },
  
  // James Kip Finch (more)
  { text: "The engineer is the key figure in the material progress of the world.", author: "James Kip Finch", year: "1960" },
  
  // More Lonnie Johnson
  { text: "What drives me is what I see out there that needs doing.", author: "Lonnie Johnson", year: "1991" },
  
  // More Patricia Bath
  { text: "My interest and studies in ophthalmology began in 1965 at Harlem Hospital, where I worked in the ophthalmology clinic and eye surgery department.", author: "Patricia Bath", year: "1988" },
  
  // More Garrett Morgan
  { text: "I will do whatever it takes to make this invention a success.", author: "Garrett Morgan", year: "1914" },
  
  // More Granville Woods
  { text: "I dedicate this to the young men and young women of my race.", author: "Granville Woods", year: "1887" },
  
  // More Lewis Latimer
  { text: "We live in a world which is full of misery and ignorance, and the plain duty of each and all of us is to try to make the little corner he can influence somewhat less miserable and somewhat less ignorant than it was.", author: "Lewis Latimer" },
  
  // More Wallace Carothers
  { text: "The problem of polymerization is to understand how these small molecules combine to form large ones.", author: "Wallace Carothers", year: "1929" },
  
  // More Stephanie Kwolek
  { text: "I was lucky enough to be able to do what I wanted to do, which was to work in science.", author: "Stephanie Kwolek", year: "1965" },
  { text: "I don't think many people realize how useful fibers are.", author: "Stephanie Kwolek" },
  
  // More Chester Carlson
  { text: "The idea came to me while I was making carbon copies of patent specifications.", author: "Chester Carlson", year: "1938" },
  
  // More Percy Spencer
  { text: "The difference between the people who succeed and the people who don't is that the people who succeed keep on trying.", author: "Percy Spencer", year: "1946" },
  
  // More Elias Howe
  { text: "I was trying to find a way to make a sewing machine work, and the dream gave me the answer.", author: "Elias Howe", year: "1845" },
  
  // More George Pullman
  { text: "Labor and capital are friendly. They never should be enemies.", author: "George Pullman", year: "1885" },
  
  // More George Eastman
  { text: "You push the button, we do the rest.", author: "George Eastman", year: "1888" },
  { text: "The progress of the world depends almost entirely upon education.", author: "George Eastman" },
  
  // More Jan Ernst Matzeliger
  { text: "I believe I can make a machine that will last forever.", author: "Jan Ernst Matzeliger", year: "1883" },
  
  // Additional Historical Scientists and Engineers
  { text: "I would rather discover one scientific fact than become King of Persia.", author: "Democritus", year: "400 BC" },
  { text: "The laws of nature are but the mathematical thoughts of God.", author: "Euclid", year: "300 BC" },
  { text: "Mathematics is the door and key to the sciences.", author: "Roger Bacon", year: "1267" },
  { text: "The authority of those who teach is often an obstacle to those who want to learn.", author: "Marcus Tullius Cicero", year: "50 BC" },
  { text: "In wine there is wisdom, in beer there is freedom, in water there is bacteria.", author: "Benjamin Franklin" },
  
  // Nicolaus Copernicus
  { text: "To know that we know what we know, and to know that we do not know what we do not know, that is true knowledge.", author: "Nicolaus Copernicus", year: "1543" },
  { text: "Mathematics is written for mathematicians.", author: "Nicolaus Copernicus" },
  
  // Tycho Brahe
  { text: "Let me not seem to have lived in vain.", author: "Tycho Brahe", year: "1601" },
  { text: "O credulity of mortals! How little weight do facts have when they contradict our prejudices!", author: "Tycho Brahe" },
  
  // Gottfried Leibniz
  { text: "Music is the pleasure the human mind experiences from counting without being aware that it is counting.", author: "Gottfried Leibniz", year: "1712" },
  { text: "It is unworthy of excellent men to lose hours like slaves in the labour of calculation.", author: "Gottfried Leibniz" },
  { text: "The present is big with the future.", author: "Gottfried Leibniz" },
  { text: "To love is to find pleasure in the happiness of others.", author: "Gottfried Leibniz" },
  
  // Leonhard Euler
  { text: "Although to penetrate into the intimate mysteries of nature and thence to learn the true causes of phenomena is not allowed to us, nevertheless it can happen that a certain fictive hypothesis may suffice for explaining many phenomena.", author: "Leonhard Euler", year: "1750" },
  { text: "Logic is the foundation of the certainty of all the knowledge we acquire.", author: "Leonhard Euler" },
  
  // Pierre-Simon Laplace
  { text: "What we know is not much. What we do not know is immense.", author: "Pierre-Simon Laplace", year: "1827" },
  { text: "It is remarkable that a science which began with the consideration of games of chance should have become the most important object of human knowledge.", author: "Pierre-Simon Laplace" },
  
  // André-Marie Ampère
  { text: "The future science of government should be called 'la science sociale.'", author: "André-Marie Ampère", year: "1830" },
  { text: "Either one must be able to do everything or nothing.", author: "André-Marie Ampère" },
  
  // Michael Faraday
  { text: "Nothing is too wonderful to be true if it be consistent with the laws of nature.", author: "Michael Faraday", year: "1849" },
  { text: "Work. Finish. Publish.", author: "Michael Faraday" },
  { text: "The five essential entrepreneurial skills for success are concentration, discrimination, organization, innovation and communication.", author: "Michael Faraday" },
  { text: "A man who is certain he is right is almost sure to be wrong.", author: "Michael Faraday" },
  { text: "Lectures which really teach will never be popular; lectures which are popular will never really teach.", author: "Michael Faraday" },
  
  // James Clerk Maxwell
  { text: "The true logic of this world is in the calculus of probabilities.", author: "James Clerk Maxwell", year: "1850" },
  { text: "Thoroughly conscious ignorance is the prelude to every real advance in science.", author: "James Clerk Maxwell" },
  { text: "All the mathematical sciences are founded on relations between physical laws and laws of numbers.", author: "James Clerk Maxwell" },
  { text: "One scientific epoch ended and another began with James Clerk Maxwell.", author: "Albert Einstein" },
  
  // Lord Kelvin (William Thomson)
  { text: "If you can not measure it, you can not improve it.", author: "Lord Kelvin", year: "1883" },
  { text: "Do not imagine that mathematics is hard and crabbed, and repulsive to common sense.", author: "Lord Kelvin" },
  { text: "Large increases in cost with questionable increases in performance can be tolerated only in race horses and fancy dogs.", author: "Lord Kelvin" },
  { text: "I often say that when you can measure what you are speaking about, and express it in numbers, you know something about it.", author: "Lord Kelvin", year: "1891" },
  
  // Dmitri Mendeleev
  { text: "I saw in a dream a table where all the elements fell into place as required. Awakening, I immediately wrote it down on a piece of paper.", author: "Dmitri Mendeleev", year: "1869" },
  { text: "There is nothing in this world that I fear to say.", author: "Dmitri Mendeleev" },
  { text: "Work, look for peace and calm in work: you will find it nowhere else.", author: "Dmitri Mendeleev" },
  
  // Wilhelm Röntgen
  { text: "I did not think, I investigated.", author: "Wilhelm Röntgen", year: "1895" },
  { text: "I was working with a Crookes tube covered by a shield of black cardboard. A piece of paper coated with barium platinocyanide lay on the bench.", author: "Wilhelm Röntgen", year: "1895" },
  
  // Max Planck
  { text: "Science cannot solve the ultimate mystery of nature. And that is because, in the last analysis, we ourselves are part of nature and therefore part of the mystery that we are trying to solve.", author: "Max Planck", year: "1932" },
  { text: "A new scientific truth does not triumph by convincing its opponents, but rather because its opponents eventually die.", author: "Max Planck", year: "1950" },
  { text: "An important scientific innovation rarely makes its way by gradually winning over and converting its opponents.", author: "Max Planck" },
  { text: "Anybody who has been seriously engaged in scientific work of any kind realizes that over the entrance to the gates of the temple of science are written the words: 'Ye must have faith.'", author: "Max Planck" },
  
  // Niels Bohr
  { text: "An expert is a person who has made all the mistakes that can be made in a very narrow field.", author: "Niels Bohr", year: "1952" },
  { text: "Prediction is very difficult, especially about the future.", author: "Niels Bohr" },
  { text: "The opposite of a correct statement is a false statement. But the opposite of a profound truth may well be another profound truth.", author: "Niels Bohr" },
  { text: "If quantum mechanics hasn't profoundly shocked you, you haven't understood it yet.", author: "Niels Bohr" },
  { text: "We are all agreed that your theory is crazy. The question which divides us is whether it is crazy enough.", author: "Niels Bohr", year: "1958" },
  { text: "Everything we call real is made of things that cannot be regarded as real.", author: "Niels Bohr" },
  
  // Erwin Schrödinger
  { text: "The task is not so much to see what no one has yet seen; but to think what nobody has yet thought, about that which everybody sees.", author: "Erwin Schrödinger", year: "1944" },
  { text: "I don't like it, and I'm sorry I ever had anything to do with it.", author: "Erwin Schrödinger", year: "1952" },
  
  // Werner Heisenberg
  { text: "The first gulp from the glass of natural sciences will turn you into an atheist, but at the bottom of the glass God is waiting for you.", author: "Werner Heisenberg", year: "1927" },
  { text: "What we observe is not nature itself, but nature exposed to our method of questioning.", author: "Werner Heisenberg" },
  { text: "An expert is someone who knows some of the worst mistakes that can be made in his subject, and how to avoid them.", author: "Werner Heisenberg" },
  { text: "Not only is the Universe stranger than we think, it is stranger than we can think.", author: "Werner Heisenberg" },
  
  // Enrico Fermi
  { text: "Before I came here I was confused about this subject. Having listened to your lecture I am still confused. But on a higher level.", author: "Enrico Fermi", year: "1954" },
  { text: "There are two possible outcomes: if the result confirms the hypothesis, then you've made a measurement. If the result is contrary to the hypothesis, then you've made a discovery.", author: "Enrico Fermi" },
  { text: "If I could remember the names of all these particles, I would have been a botanist.", author: "Enrico Fermi" },
  
  // Richard Feynman
  { text: "I would rather have questions that can't be answered than answers that can't be questioned.", author: "Richard Feynman", year: "1988" },
  { text: "The first principle is that you must not fool yourself and you are the easiest person to fool.", author: "Richard Feynman", year: "1974" },
  { text: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.", author: "Richard Feynman" },
  { text: "I think it's much more interesting to live not knowing than to have answers which might be wrong.", author: "Richard Feynman" },
  { text: "What I cannot create, I do not understand.", author: "Richard Feynman", year: "1988" },
  { text: "Nature uses only the longest threads to weave her patterns, so that each small piece of her fabric reveals the organization of the entire tapestry.", author: "Richard Feynman" },
  { text: "Physics is like sex: sure, it may give some practical results, but that's not why we do it.", author: "Richard Feynman" },
  { text: "If you thought that science was certain - well, that is just an error on your part.", author: "Richard Feynman" },
  
  // J. Robert Oppenheimer
  { text: "The optimist thinks this is the best of all possible worlds. The pessimist fears it is true.", author: "J. Robert Oppenheimer", year: "1945" },
  { text: "Now I am become Death, the destroyer of worlds.", author: "J. Robert Oppenheimer", year: "1945" },
  { text: "There must be no barriers to freedom of inquiry.", author: "J. Robert Oppenheimer" },
  { text: "The atomic bomb made the prospect of future war unendurable.", author: "J. Robert Oppenheimer", year: "1946" },
  
  // Linus Pauling
  { text: "The best way to have a good idea is to have lots of ideas.", author: "Linus Pauling", year: "1955" },
  { text: "Satisfaction of one's curiosity is one of the greatest sources of happiness in life.", author: "Linus Pauling" },
  { text: "If you want to have good ideas you must have many ideas.", author: "Linus Pauling" },
  { text: "Science is the search for truth - it is not a game in which one tries to beat his opponent.", author: "Linus Pauling" },
  
  // James Watson and Francis Crick
  { text: "It has not escaped our notice that the specific pairing we have postulated immediately suggests a possible copying mechanism for the genetic material.", author: "James Watson", year: "1953" },
  { text: "Science seldom proceeds in the straightforward logical manner imagined by outsiders.", author: "James Watson" },
  { text: "A structure this pretty just had to exist.", author: "James Watson", year: "1953" },
  
  // Alan Turing
  { text: "Sometimes it is the people no one can imagine anything of who do the things no one can imagine.", author: "Alan Turing", year: "1950" },
  { text: "We can only see a short distance ahead, but we can see plenty there that needs to be done.", author: "Alan Turing", year: "1950" },
  { text: "A computer would deserve to be called intelligent if it could deceive a human into believing that it was human.", author: "Alan Turing", year: "1950" },
  { text: "Those who can imagine anything, can create the impossible.", author: "Alan Turing" },
  { text: "Science is a differential equation. Religion is a boundary condition.", author: "Alan Turing" },
  
  // John von Neumann
  { text: "If people do not believe that mathematics is simple, it is only because they do not realize how complicated life is.", author: "John von Neumann", year: "1947" },
  { text: "In mathematics you don't understand things. You just get used to them.", author: "John von Neumann" },
  { text: "Young man, in mathematics you don't understand things. You just get used to them.", author: "John von Neumann", year: "1945" },
  { text: "There's no sense in being precise when you don't even know what you're talking about.", author: "John von Neumann" },
  
  // Claude Shannon
  { text: "Information is the resolution of uncertainty.", author: "Claude Shannon", year: "1948" },
  { text: "I just wondered how things were put together.", author: "Claude Shannon" },
  { text: "The fundamental problem of communication is that of reproducing at one point either exactly or approximately a message selected at another point.", author: "Claude Shannon", year: "1948" },
  
  // Norbert Wiener
  { text: "The best material model of a cat is another, or preferably the same, cat.", author: "Norbert Wiener", year: "1950" },
  { text: "Progress imposes not only new possibilities for the future but new restrictions.", author: "Norbert Wiener" },
  { text: "We have modified our environment so radically that we must now modify ourselves to exist in this new environment.", author: "Norbert Wiener", year: "1950" },
  
  // Kurt Gödel
  { text: "Either mathematics is too big for the human mind or the human mind is more than a machine.", author: "Kurt Gödel", year: "1931" },
  { text: "The more I think about language, the more it amazes me that people ever understand each other at all.", author: "Kurt Gödel" },
  
  // Emmy Noether
  { text: "My methods are really methods of working and thinking; this is why they have crept in everywhere anonymously.", author: "Emmy Noether", year: "1935" },
  
  // Additional Wisdom from Ancient Engineers and Builders
  { text: "Well begun is half done.", author: "Aristotle" },
  { text: "We are what we repeatedly do. Excellence is not an act but a habit.", author: "Aristotle" },
  { text: "The whole is greater than the sum of its parts.", author: "Aristotle" },
  { text: "Man is by nature a social animal.", author: "Aristotle" },
  
  // Vitruvius (Roman Architect and Engineer)
  { text: "The ideal building has three elements; it is sturdy, useful, and beautiful.", author: "Vitruvius", year: "15 BC" },
  { text: "Architecture is a science arising out of many other sciences, and adorned with much and varied learning.", author: "Vitruvius", year: "15 BC" },
  
  // Hero of Alexandria
  { text: "The wind, in passing through the confined space, will necessarily rush with greater velocity.", author: "Hero of Alexandria", year: "60" },
  
  // Zhang Heng (Chinese Polymath)
  { text: "Innovations are the unorthodox workings of extraordinary minds.", author: "Zhang Heng", year: "132" },
  
  // Al-Khwarizmi
  { text: "That fondness for science, that affability and condescension which God shows to the learned, that promptitude with which he protects and supports them.", author: "Al-Khwarizmi", year: "820" },
  
  // Omar Khayyam
  { text: "Ah, but my Computations, People say, Reduced the Year to better reckoning? Nay, 'Twas only striking from the Calendar Unborn To-morrow, and dead Yesterday.", author: "Omar Khayyam", year: "1070" },
  
  // Additional Proverbs and Wisdom
  { text: "Give me six hours to chop down a tree and I will spend the first four sharpening the axe.", author: "Abraham Lincoln", year: "1860" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay", year: "1971" },
  { text: "Whatever the mind can conceive and believe, it can achieve.", author: "Napoleon Hill", year: "1937" },
  { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", author: "William Butler Yeats", year: "1889" },
  { text: "The secret to creativity is knowing how to hide your sources.", author: "Albert Einstein" },
  { text: "Small opportunities are often the beginning of great enterprises.", author: "Demosthenes", year: "340 BC" },
  { text: "What is now proved was once only imagined.", author: "William Blake", year: "1790" },
  { text: "Good judgment comes from experience, and experience comes from bad judgment.", author: "Frederick P. Brooks Jr.", year: "1975" },
  
  // More Abraham Lincoln
  { text: "Whatever you are, be a good one.", author: "Abraham Lincoln" },
  { text: "The best thing about the future is that it comes one day at a time.", author: "Abraham Lincoln" },
  { text: "I am a slow walker, but I never walk back.", author: "Abraham Lincoln", year: "1860" },
  { text: "Things may come to those who wait, but only the things left by those who hustle.", author: "Abraham Lincoln" },
  { text: "Always bear in mind that your own resolution to succeed is more important than any other.", author: "Abraham Lincoln" },
  { text: "I will prepare and some day my chance will come.", author: "Abraham Lincoln", year: "1858" },
  { text: "The probability that we may fail in the struggle ought not to deter us from the support of a cause we believe to be just.", author: "Abraham Lincoln", year: "1839" },
  
  // William Blake
  { text: "To see a World in a Grain of Sand, and a Heaven in a Wild Flower, hold Infinity in the palm of your hand, and Eternity in an hour.", author: "William Blake", year: "1803" },
  { text: "The true method of knowledge is experiment.", author: "William Blake" },
  { text: "Without contraries is no progression.", author: "William Blake", year: "1790" },
  { text: "The tigers of wrath are wiser than the horses of instruction.", author: "William Blake", year: "1790" },
  { text: "If the doors of perception were cleansed every thing would appear to man as it is, infinite.", author: "William Blake", year: "1790" },
  { text: "Exuberance is beauty.", author: "William Blake" },
  { text: "No bird soars too high if he soars with his own wings.", author: "William Blake" },
  { text: "The man who never alters his opinion is like standing water, and breeds reptiles of the mind.", author: "William Blake" },
  
  // William Butler Yeats (more)
  { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "William Butler Yeats" },
  { text: "Think like a wise man but communicate in the language of the people.", author: "William Butler Yeats" },
  { text: "There are no strangers here; Only friends you haven't yet met.", author: "William Butler Yeats" },
  { text: "The world is full of magic things, patiently waiting for our senses to grow sharper.", author: "William Butler Yeats" },
  
  // Mark Twain
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain", year: "1897" },
  { text: "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do.", author: "Mark Twain" },
  { text: "It ain't what you don't know that gets you into trouble. It's what you know for sure that just ain't so.", author: "Mark Twain" },
  { text: "Continuous improvement is better than delayed perfection.", author: "Mark Twain" },
  { text: "The man who does not read has no advantage over the man who cannot read.", author: "Mark Twain" },
  { text: "I have never let my schooling interfere with my education.", author: "Mark Twain" },
  { text: "Courage is resistance to fear, mastery of fear, not absence of fear.", author: "Mark Twain", year: "1894" },
  { text: "To succeed in life, you need two things: ignorance and confidence.", author: "Mark Twain" },
  { text: "Keep away from people who try to belittle your ambitions. Small people always do that, but the really great make you feel that you, too, can become great.", author: "Mark Twain" },
  { text: "The two most important days in your life are the day you are born and the day you find out why.", author: "Mark Twain" },
  { text: "If you tell the truth, you don't have to remember anything.", author: "Mark Twain" },
  { text: "Kindness is the language which the deaf can hear and the blind can see.", author: "Mark Twain" },
  { text: "A person who won't read has no advantage over one who can't read.", author: "Mark Twain" },
  { text: "Good friends, good books, and a sleepy conscience: this is the ideal life.", author: "Mark Twain" },
  { text: "The fear of death follows from the fear of life. A man who lives fully is prepared to die at any time.", author: "Mark Twain" },
  
  // Ralph Waldo Emerson
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson", year: "1841" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "Write it on your heart that every day is the best day in the year.", author: "Ralph Waldo Emerson" },
  { text: "For every minute you are angry you lose sixty seconds of happiness.", author: "Ralph Waldo Emerson" },
  { text: "Nothing great was ever achieved without enthusiasm.", author: "Ralph Waldo Emerson", year: "1841" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
  { text: "The creation of a thousand forests is in one acorn.", author: "Ralph Waldo Emerson" },
  { text: "Make the most of yourself, for that is all there is of you.", author: "Ralph Waldo Emerson" },
  { text: "Adopt the pace of nature: her secret is patience.", author: "Ralph Waldo Emerson" },
  { text: "A foolish consistency is the hobgoblin of little minds.", author: "Ralph Waldo Emerson", year: "1841" },
  { text: "The mind, once stretched by a new idea, never returns to its original dimensions.", author: "Ralph Waldo Emerson" },
  { text: "Life is a journey, not a destination.", author: "Ralph Waldo Emerson" },
  { text: "Cultivate the habit of being grateful for every good thing that comes to you.", author: "Ralph Waldo Emerson" },
  { text: "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate.", author: "Ralph Waldo Emerson" },
  
  // Henry David Thoreau
  { text: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau", year: "1854" },
  { text: "It's not what you look at that matters, it's what you see.", author: "Henry David Thoreau" },
  { text: "The price of anything is the amount of life you exchange for it.", author: "Henry David Thoreau" },
  { text: "If you have built castles in the air, your work need not be lost; that is where they should be. Now put the foundations under them.", author: "Henry David Thoreau", year: "1854" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Henry David Thoreau" },
  { text: "Things do not change; we change.", author: "Henry David Thoreau" },
  { text: "Rather than love, than money, than fame, give me truth.", author: "Henry David Thoreau", year: "1854" },
  { text: "How vain it is to sit down to write when you have not stood up to live.", author: "Henry David Thoreau" },
  { text: "Our life is frittered away by detail. Simplify, simplify.", author: "Henry David Thoreau", year: "1854" },
  { text: "The mass of men lead lives of quiet desperation.", author: "Henry David Thoreau", year: "1854" },
  { text: "Live your beliefs and you can turn the world around.", author: "Henry David Thoreau" },
  { text: "Goodness is the only investment that never fails.", author: "Henry David Thoreau" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "Be true to your work, your word, and your friend.", author: "Henry David Thoreau" },
  { text: "I learned this, at least, by my experiment: that if one advances confidently in the direction of his dreams, he will meet with a success unexpected in common hours.", author: "Henry David Thoreau", year: "1854" },
  
  // Walt Whitman
  { text: "Keep your face always toward the sunshine, and shadows will fall behind you.", author: "Walt Whitman", year: "1855" },
  { text: "Be curious, not judgmental.", author: "Walt Whitman" },
  { text: "We convince by our presence.", author: "Walt Whitman" },
  { text: "Whatever satisfies the soul is truth.", author: "Walt Whitman" },
  { text: "I exist as I am, that is enough.", author: "Walt Whitman", year: "1855" },
  { text: "Resist much, obey little.", author: "Walt Whitman" },
  { text: "The powerful play goes on, and you may contribute a verse.", author: "Walt Whitman", year: "1892" },
  { text: "Do I contradict myself? Very well then I contradict myself, I am large, I contain multitudes.", author: "Walt Whitman", year: "1855" },
  
  // Johann Wolfgang von Goethe
  { text: "Knowing is not enough; we must apply. Willing is not enough; we must do.", author: "Johann Wolfgang von Goethe", year: "1832" },
  { text: "Whatever you can do or dream you can, begin it. Boldness has genius, power and magic in it.", author: "Johann Wolfgang von Goethe" },
  { text: "Magic is believing in yourself, if you can do that, you can make anything happen.", author: "Johann Wolfgang von Goethe" },
  { text: "In the realm of ideas everything depends on enthusiasm; in the real world all rests on perseverance.", author: "Johann Wolfgang von Goethe" },
  { text: "A man sees in the world what he carries in his heart.", author: "Johann Wolfgang von Goethe", year: "1774" },
  { text: "Everything is hard before it is easy.", author: "Johann Wolfgang von Goethe" },
  { text: "The way you see people is the way you treat them, and the way you treat them is what they become.", author: "Johann Wolfgang von Goethe" },
  { text: "A man's manners are a mirror in which he shows his portrait.", author: "Johann Wolfgang von Goethe" },
  { text: "By seeking and blundering we learn.", author: "Johann Wolfgang von Goethe" },
  { text: "There is nothing insignificant in the world. It all depends on the point of view.", author: "Johann Wolfgang von Goethe" },
  { text: "The way you see people is the way you treat them.", author: "Johann Wolfgang von Goethe" },
  { text: "Man is made by his belief. As he believes, so he is.", author: "Johann Wolfgang von Goethe" },
  { text: "To think is easy. To act is hard. But the hardest thing in the world is to act in accordance with your thinking.", author: "Johann Wolfgang von Goethe" },
  { text: "None are more hopelessly enslaved than those who falsely believe they are free.", author: "Johann Wolfgang von Goethe", year: "1809" },
  { text: "One ought, every day at least, to hear a little song, read a good poem, see a fine picture, and, if it were possible, to speak a few reasonable words.", author: "Johann Wolfgang von Goethe", year: "1809" },
  
  // Friedrich Nietzsche
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche", year: "1889" },
  { text: "That which does not kill us makes us stronger.", author: "Friedrich Nietzsche", year: "1888" },
  { text: "In individuals, insanity is rare; but in groups, parties, nations and epochs, it is the rule.", author: "Friedrich Nietzsche", year: "1886" },
  { text: "Without music, life would be a mistake.", author: "Friedrich Nietzsche", year: "1889" },
  { text: "And those who were seen dancing were thought to be insane by those who could not hear the music.", author: "Friedrich Nietzsche" },
  { text: "The individual has always had to struggle to keep from being overwhelmed by the tribe.", author: "Friedrich Nietzsche" },
  { text: "The snake which cannot cast its skin has to die.", author: "Friedrich Nietzsche" },
  { text: "All truly great thoughts are conceived by walking.", author: "Friedrich Nietzsche", year: "1889" },
  { text: "He who fights with monsters should be careful lest he thereby become a monster.", author: "Friedrich Nietzsche", year: "1886" },
  { text: "There is always some madness in love. But there is also always some reason in madness.", author: "Friedrich Nietzsche", year: "1883" },
  
  // Arthur Schopenhauer
  { text: "Talent hits a target no one else can hit; Genius hits a target no one else can see.", author: "Arthur Schopenhauer", year: "1851" },
  { text: "The two enemies of human happiness are pain and boredom.", author: "Arthur Schopenhauer" },
  { text: "We forfeit three-fourths of ourselves in order to be like other people.", author: "Arthur Schopenhauer" },
  { text: "All truth passes through three stages. First, it is ridiculed. Second, it is violently opposed. Third, it is accepted as being self-evident.", author: "Arthur Schopenhauer" },
  { text: "To find out your real opinion of someone, judge the impression you have when you first see a letter from them.", author: "Arthur Schopenhauer" },
  
  // Voltaire
  { text: "Judge a man by his questions rather than by his answers.", author: "Voltaire", year: "1764" },
  { text: "Common sense is not so common.", author: "Voltaire", year: "1764" },
  { text: "Doubt is an uncomfortable condition, but certainty is a ridiculous one.", author: "Voltaire" },
  { text: "Perfect is the enemy of good.", author: "Voltaire", year: "1770" },
  { text: "Every man is guilty of all the good he did not do.", author: "Voltaire" },
  { text: "Appreciation is a wonderful thing. It makes what is excellent in others belong to us as well.", author: "Voltaire" },
  { text: "Life is a shipwreck, but we must not forget to sing in the lifeboats.", author: "Voltaire" },
  { text: "It is dangerous to be right in matters on which the established authorities are wrong.", author: "Voltaire", year: "1733" },
  { text: "Prejudices are what fools use for reason.", author: "Voltaire" },
  { text: "If you want to converse with me, define your terms.", author: "Voltaire" },
  
  // Jean-Jacques Rousseau
  { text: "Man is born free, and everywhere he is in chains.", author: "Jean-Jacques Rousseau", year: "1762" },
  { text: "Patience is bitter, but its fruit is sweet.", author: "Jean-Jacques Rousseau" },
  { text: "The world of reality has its limits; the world of imagination is boundless.", author: "Jean-Jacques Rousseau", year: "1762" },
  { text: "What wisdom can you find that is greater than kindness?", author: "Jean-Jacques Rousseau" },
  { text: "I prefer liberty with danger than peace with slavery.", author: "Jean-Jacques Rousseau", year: "1762" },
  
  // Immanuel Kant
  { text: "Science is organized knowledge. Wisdom is organized life.", author: "Immanuel Kant", year: "1790" },
  { text: "We can judge the heart of a man by his treatment of animals.", author: "Immanuel Kant" },
  { text: "All our knowledge begins with the senses, proceeds then to the understanding, and ends with reason.", author: "Immanuel Kant", year: "1781" },
  { text: "In law a man is guilty when he violates the rights of others. In ethics he is guilty if he only thinks of doing so.", author: "Immanuel Kant" },
  { text: "Act only according to that maxim whereby you can, at the same time, will that it should become a universal law.", author: "Immanuel Kant", year: "1785" },
  { text: "He who is cruel to animals becomes hard also in his dealings with men.", author: "Immanuel Kant" },
  
  // Marcus Aurelius
  { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius", year: "170" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius", year: "170" },
  { text: "If it is not right do not do it; if it is not true do not say it.", author: "Marcus Aurelius", year: "170" },
  { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius", year: "170" },
  { text: "The best revenge is to be unlike him who performed the injury.", author: "Marcus Aurelius", year: "170" },
  { text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author: "Marcus Aurelius", year: "170" },
  { text: "When you arise in the morning, think of what a precious privilege it is to be alive - to breathe, to think, to enjoy, to love.", author: "Marcus Aurelius", year: "170" },
  { text: "The object of life is not to be on the side of the majority, but to escape finding oneself in the ranks of the insane.", author: "Marcus Aurelius", year: "170" },
  { text: "Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth.", author: "Marcus Aurelius", year: "170" },
  { text: "It is not death that a man should fear, but he should fear never beginning to live.", author: "Marcus Aurelius", year: "170" },
  
  // Seneca
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca", year: "50" },
  { text: "It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult.", author: "Seneca", year: "50" },
  { text: "We suffer more often in imagination than in reality.", author: "Seneca", year: "50" },
  { text: "Difficulties strengthen the mind, as labor does the body.", author: "Seneca", year: "50" },
  { text: "As is a tale, so is life: not how long it is, but how good it is, is what matters.", author: "Seneca", year: "50" },
  { text: "If a man knows not to which port he sails, no wind is favorable.", author: "Seneca", year: "50" },
  { text: "Begin at once to live, and count each separate day as a separate life.", author: "Seneca", year: "50" },
  { text: "Hang on to your youthful enthusiasms - you'll be able to use them better when you're older.", author: "Seneca", year: "50" },
  { text: "All cruelty springs from weakness.", author: "Seneca", year: "50" },
  { text: "True happiness is to enjoy the present, without anxious dependence upon the future.", author: "Seneca", year: "50" },
  
  // Epictetus
  { text: "It's not what happens to you, but how you react to it that matters.", author: "Epictetus", year: "100" },
  { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus", year: "100" },
  { text: "No man is free who is not master of himself.", author: "Epictetus", year: "100" },
  { text: "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.", author: "Epictetus", year: "100" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus", year: "100" },
  { text: "There is only one way to happiness and that is to cease worrying about things which are beyond the power of our will.", author: "Epictetus", year: "100" },
  { text: "If anyone tells you that a certain person speaks ill of you, do not make excuses about what is said of you but answer, He was ignorant of my other faults, else he would not have mentioned these alone.", author: "Epictetus", year: "100" },
  { text: "Don't explain your philosophy. Embody it.", author: "Epictetus", year: "100" },
  
  // Sun Tzu
  { text: "Know yourself and you will win all battles.", author: "Sun Tzu", year: "500 BC" },
  { text: "In the midst of chaos, there is also opportunity.", author: "Sun Tzu", year: "500 BC" },
  { text: "The supreme art of war is to subdue the enemy without fighting.", author: "Sun Tzu", year: "500 BC" },
  { text: "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.", author: "Sun Tzu", year: "500 BC" },
  { text: "Appear weak when you are strong, and strong when you are weak.", author: "Sun Tzu", year: "500 BC" },
  { text: "If you know the enemy and know yourself, you need not fear the result of a hundred battles.", author: "Sun Tzu", year: "500 BC" },
  { text: "Opportunities multiply as they are seized.", author: "Sun Tzu", year: "500 BC" },
  { text: "Can you imagine what I would do if I could do all I can?", author: "Sun Tzu", year: "500 BC" },
  { text: "The wise warrior avoids the battle.", author: "Sun Tzu", year: "500 BC" },
  { text: "Move swift as the Wind and closely-formed as the Wood. Attack like the Fire and be still as the Mountain.", author: "Sun Tzu", year: "500 BC" },
  
  // Heraclitus
  { text: "The only constant in life is change.", author: "Heraclitus", year: "500 BC" },
  { text: "No man ever steps in the same river twice.", author: "Heraclitus", year: "500 BC" },
  { text: "Out of every one hundred men, ten shouldn't even be there, eighty are just targets, nine are the real fighters, and we are lucky to have them, for they make the battle. Ah, but the one, one is a warrior.", author: "Heraclitus", year: "500 BC" },
  { text: "Big results require big ambitions.", author: "Heraclitus", year: "500 BC" },
  { text: "Day by day, what you choose, what you think and what you do is who you become.", author: "Heraclitus", year: "500 BC" },
  { text: "Character is destiny.", author: "Heraclitus", year: "500 BC" },
  { text: "Much learning does not teach understanding.", author: "Heraclitus", year: "500 BC" },
  
  // Pythagoras
  { text: "Do not say a little in many words but a great deal in a few.", author: "Pythagoras", year: "500 BC" },
  { text: "As long as man continues to be the ruthless destroyer of lower living beings he will never know health or peace.", author: "Pythagoras", year: "500 BC" },
  { text: "Number is the ruler of forms and ideas, and the cause of gods and demons.", author: "Pythagoras", year: "500 BC" },
  { text: "Educate the children and it won't be necessary to punish the men.", author: "Pythagoras", year: "500 BC" },
  { text: "Choose rather to be strong of soul than strong of body.", author: "Pythagoras", year: "500 BC" },
  
  // Additional Leonardo da Vinci wisdom
  { text: "One can have no smaller or greater mastery than mastery of oneself.", author: "Leonardo da Vinci" },
  { text: "Experience does not err. Only your judgments err by expecting from her what is not in her power.", author: "Leonardo da Vinci" },
  { text: "In rivers, the water that you touch is the last of what has passed and the first of that which comes; so with present time.", author: "Leonardo da Vinci" },
  { text: "While I thought that I was learning how to live, I have been learning how to die.", author: "Leonardo da Vinci" },
  
  // More quotes from various makers
  { text: "An investment in knowledge always pays the best interest.", author: "Benjamin Franklin" },
  { text: "I think and think for months and years. Ninety-nine times, the conclusion is false. The hundredth time I am right.", author: "Albert Einstein" },
  
  // Additional Wright Brothers
  { text: "We were lucky enough to grow up in an environment where there was always much encouragement to children to pursue intellectual interests.", author: "Orville Wright" },
  
  // More Demosthenes
  { text: "We have many advantages. We have the opportunity which our fathers had not. We can build on their foundation.", author: "Demosthenes", year: "340 BC" },
  
  // Historical Engineers and Craftsmen
  { text: "In every block of marble I see a statue as plain as though it stood before me, shaped and perfect in attitude and action. I have only to hew away the rough walls that imprison the lovely apparition to reveal it.", author: "Michelangelo" },
  { text: "The sculptor produces the beautiful statue by chipping away such parts of the marble block as are not needed.", author: "Aristotle" },
  
  // More Historical Wisdom
  { text: "Well done is quickly done.", author: "Augustus Caesar", year: "10 BC" },
  { text: "Make haste slowly.", author: "Augustus Caesar", year: "10 BC" },
  { text: "I found Rome a city of bricks and left it a city of marble.", author: "Augustus Caesar", year: "14" },
  
  // Leonardo again (more gems)
  { text: "All sciences are vain and full of errors that are not born of Experience, mother of all certainty.", author: "Leonardo da Vinci" },
  { text: "Wisdom is the daughter of experience.", author: "Leonardo da Vinci" },
  { text: "Learning acquired in youth arrests the evil of old age.", author: "Leonardo da Vinci" },
  { text: "The desire to know is natural to good men.", author: "Leonardo da Vinci" },
  { text: "I have offended God and mankind because my work didn't reach the quality it should have.", author: "Leonardo da Vinci" },
  { text: "Why does the eye see a thing more clearly in dreams than the imagination when awake?", author: "Leonardo da Vinci" },
  { text: "Life well spent is long.", author: "Leonardo da Vinci" },
  { text: "As a well-spent day brings happy sleep, so a life well spent brings happy death.", author: "Leonardo da Vinci" },
  { text: "Water is the driving force of all nature.", author: "Leonardo da Vinci" },
  { text: "The function of muscle is to pull and not to push, except in the case of the genitals and the tongue.", author: "Leonardo da Vinci" },
  
  // More Tesla wisdom
  { text: "The spread of civilization may be likened to a fire; first, a feeble spark, next a flickering flame, then a mighty blaze.", author: "Nikola Tesla" },
  { text: "The progressive development of man is vitally dependent on invention.", author: "Nikola Tesla" },
  { text: "Our senses enable us to perceive only a minute portion of the outside world.", author: "Nikola Tesla" },
  { text: "Electric power is everywhere present in unlimited quantities and can drive the world's machinery.", author: "Nikola Tesla" },
  { text: "Instinct is something which transcends knowledge.", author: "Nikola Tesla" },
  { text: "The day when we shall know exactly what electricity is will chronicle an event probably greater than any other recorded in history.", author: "Nikola Tesla" },
  { text: "We build but to tear down. Most of our work and resource is squandered.", author: "Nikola Tesla" },
  { text: "It should be borne in mind that electrical energy obtained by harnessing a waterfall is probably fifty times more effective than fuel energy.", author: "Nikola Tesla", year: "1915" },
  { text: "Though free to think and act, we are held together, like the stars in the firmament, with ties inseparable.", author: "Nikola Tesla" },
  { text: "Everyone should consider his body as a priceless gift from one whom he loves above all.", author: "Nikola Tesla" },
  
  // More Edison gems
  { text: "The doctor of the future will no longer treat the human frame with drugs, but rather will cure and prevent disease with nutrition.", author: "Thomas Edison" },
  { text: "We will make electricity so cheap that only the rich will burn candles.", author: "Thomas Edison", year: "1880" },
  { text: "I never did a day's work in my life, it was all fun.", author: "Thomas Edison" },
  { text: "The chief function of the body is to carry the brain around.", author: "Thomas Edison" },
  { text: "Genius is 1% inspiration and 99% perspiration. Accordingly, a genius is often merely a talented person who has done all of his or her homework.", author: "Thomas Edison" },
  { text: "Nearly every man who develops an idea works it up to the point where it looks impossible, and then he gets discouraged. That's not the place to become discouraged.", author: "Thomas Edison" },
  { text: "Anything that won't sell, I don't want to invent. Its sale is proof of utility, and utility is success.", author: "Thomas Edison" },
  { text: "I have friends in overalls whose friendship I would not swap for the favor of the kings of the world.", author: "Thomas Edison" },
  { text: "What a man's mind can create, man's character can control.", author: "Thomas Edison" },
  { text: "Just because something doesn't do what you planned it to do doesn't mean it's useless.", author: "Thomas Edison" },
  
  // More Einstein brilliance
  { text: "The important thing is to not stop questioning. Curiosity has its own reason for existing.", author: "Albert Einstein" },
  { text: "If you can't explain it simply, you don't understand it well enough.", author: "Albert Einstein" },
  { text: "Intellectual growth should commence at birth and cease only at death.", author: "Albert Einstein" },
  { text: "Peace cannot be kept by force; it can only be achieved by understanding.", author: "Albert Einstein", year: "1945" },
  { text: "Information is not knowledge.", author: "Albert Einstein" },
  { text: "Only a life lived for others is a life worthwhile.", author: "Albert Einstein", year: "1932" },
  { text: "I speak to everyone in the same way, whether he is the garbage man or the president of the university.", author: "Albert Einstein" },
  { text: "Great spirits have always encountered violent opposition from mediocre minds.", author: "Albert Einstein", year: "1940" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "The difference between genius and stupidity is that genius has its limits.", author: "Albert Einstein" },
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { text: "I am by heritage a Jew, by citizenship a Swiss, and by makeup a human being, and only a human being, without any special attachment to any state or national entity whatsoever.", author: "Albert Einstein", year: "1919" },
  { text: "All religions, arts and sciences are branches of the same tree.", author: "Albert Einstein", year: "1937" },
  { text: "Imagination is everything. It is the preview of life's coming attractions.", author: "Albert Einstein" },
  { text: "The world is a dangerous place to live; not because of the people who are evil, but because of the people who don't do anything about it.", author: "Albert Einstein" },
  
  // More Franklin wisdom
  { text: "Dost thou love life? Then do not squander time, for that is the stuff life is made of.", author: "Benjamin Franklin", year: "1746" },
  { text: "Without freedom of thought, there can be no such thing as wisdom.", author: "Benjamin Franklin", year: "1722" },
  { text: "Whatever is begun in anger, ends in shame.", author: "Benjamin Franklin" },
  { text: "Glass, china, and reputation are easily cracked, and never well mended.", author: "Benjamin Franklin", year: "1750" },
  { text: "Who is rich? He that is content. Who is that? Nobody.", author: "Benjamin Franklin", year: "1758" },
  { text: "Three may keep a secret, if two of them are dead.", author: "Benjamin Franklin", year: "1735" },
  { text: "Life's tragedy is that we get old too soon and wise too late.", author: "Benjamin Franklin" },
  { text: "He that can have patience can have what he will.", author: "Benjamin Franklin", year: "1736" },
  { text: "Distrust and caution are the parents of security.", author: "Benjamin Franklin", year: "1733" },
  { text: "The Constitution only guarantees the American people the right to pursue happiness. You have to catch it yourself.", author: "Benjamin Franklin", year: "1787" },
  
  // More Ford quotes
  { text: "My best friend is the one who brings out the best in me.", author: "Henry Ford" },
  { text: "It has been my observation that most people get ahead during the time that others waste.", author: "Henry Ford" },
  { text: "Chop your own wood and it will warm you twice.", author: "Henry Ford" },
  { text: "You say I started out with practically nothing, but that isn't correct. We all start with all there is.", author: "Henry Ford" },
  { text: "An idealist is a person who helps other people to be prosperous.", author: "Henry Ford" },
  { text: "The man who will use his skill and constructive imagination to see how much he can give for a dollar, instead of how little he can give for a dollar, is bound to succeed.", author: "Henry Ford" },
  { text: "Time and money spent in helping men to do more for themselves is far better than mere giving.", author: "Henry Ford" },
  { text: "As we advance in life we learn the limits of our abilities.", author: "Henry Ford" },
  { text: "One of the greatest discoveries a man makes is to find he can do what he was afraid he couldn't do.", author: "Henry Ford" },
  { text: "Before everything else, getting ready is the secret of success.", author: "Henry Ford" },
  
  // More Curie insights
  { text: "In science, we must be interested in things, not in persons.", author: "Marie Curie" },
  { text: "I am one of those who think like Nobel, that humanity will draw more good than evil from new discoveries.", author: "Marie Curie", year: "1921" },
  { text: "Have no fear of perfection; you'll never reach it.", author: "Marie Curie" },
  
  // More Newton brilliance
  { text: "Amicus Plato amicus Aristoteles magis amica veritas. (Plato is my friend, Aristotle is my friend, but my best friend is truth.)", author: "Isaac Newton" },
  { text: "I do not know what I may appear to the world; but to myself I seem to have been only like a boy playing on the seashore.", author: "Isaac Newton" },
  { text: "Gravity explains the motions of the planets, but it cannot explain who sets the planets in motion.", author: "Isaac Newton" },
  { text: "I keep the subject constantly before me and wait until the first dawnings open little by little into the full light.", author: "Isaac Newton" },
  { text: "In the absence of any other proof, the thumb alone would convince me of God's existence.", author: "Isaac Newton" },
  { text: "We build too many walls and not enough bridges.", author: "Isaac Newton" },
  { text: "It is the weight, not numbers of experiments that is to be regarded.", author: "Isaac Newton" },
  
  // More ancient wisdom
  { text: "He who is not a good servant will not be a good master.", author: "Plato" },
  { text: "No one is more hated than he who speaks the truth.", author: "Plato" },
  { text: "The measure of a man is what he does with power.", author: "Plato" },
  { text: "Courage is knowing what not to fear.", author: "Plato" },
  { text: "Thinking: the talking of the soul with itself.", author: "Plato" },
  { text: "The greatest wealth is to live content with little.", author: "Plato" },
  { text: "The object of education is to teach us to love what is beautiful.", author: "Plato" },
  { text: "Human behavior flows from three main sources: desire, emotion, and knowledge.", author: "Plato" },
  { text: "Writing is the geometry of the soul.", author: "Plato" },
  { text: "Ignorance, the root and stem of every evil.", author: "Plato" },
  
  // More Socrates
  { text: "Education is the kindling of a flame, not the filling of a vessel.", author: "Socrates" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "Be as you wish to seem.", author: "Socrates" },
  { text: "He is richest who is content with the least, for content is the wealth of nature.", author: "Socrates" },
  { text: "The only evil is ignorance; the only good is knowledge.", author: "Socrates" },
  { text: "From the deepest desires often come the deadliest hate.", author: "Socrates" },
  { text: "The way to gain a good reputation is to endeavor to be what you desire to appear.", author: "Socrates" },
  { text: "Our youth now love luxury. They have bad manners, contempt for authority; they show disrespect for their elders.", author: "Socrates" },
  
  // More Confucius
  { text: "The superior man thinks always of virtue; the common man thinks of comfort.", author: "Confucius" },
  { text: "Before you embark on a journey of revenge, dig two graves.", author: "Confucius" },
  { text: "Wheresoever you go, go with all your heart.", author: "Confucius" },
  { text: "To be wronged is nothing, unless you continue to remember it.", author: "Confucius" },
  { text: "Silence is a true friend who never betrays.", author: "Confucius" },
  { text: "He who knows all the answers has not been asked all the questions.", author: "Confucius" },
  { text: "Attack the evil that is within yourself, rather than attacking the evil that is in others.", author: "Confucius" },
  { text: "Better a diamond with a flaw than a pebble without.", author: "Confucius" },
  { text: "A superior man is modest in his speech, but exceeds in his actions.", author: "Confucius" },
  { text: "What the superior man seeks is in himself; what the small man seeks is in others.", author: "Confucius" },
  
  // More Lao Tzu
  { text: "The journey of a thousand miles begins beneath one's feet.", author: "Lao Tzu" },
  { text: "Be content with what you have; rejoice in the way things are.", author: "Lao Tzu" },
  { text: "At the center of your being you have the answer; you know who you are and you know what you want.", author: "Lao Tzu" },
  { text: "The soft overcomes the hard.", author: "Lao Tzu" },
  { text: "Silence is a source of great strength.", author: "Lao Tzu" },
  { text: "The flame that burns twice as bright burns half as long.", author: "Lao Tzu" },
  { text: "New beginnings are often disguised as painful endings.", author: "Lao Tzu" },
  { text: "Respond intelligently even to unintelligent treatment.", author: "Lao Tzu" },
  { text: "He who talks more is sooner exhausted.", author: "Lao Tzu" },
  { text: "Fill your bowl to the brim and it will spill. Keep sharpening your knife and it will blunt.", author: "Lao Tzu" },
  
  // Final additions - Rounding to 1000
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso", year: "1950" },
  { text: "Every child is an artist. The problem is how to remain an artist once we grow up.", author: "Pablo Picasso", year: "1954" },
  { text: "I am always doing that which I cannot do, in order that I may learn how to do it.", author: "Pablo Picasso", year: "1935" },
  { text: "The purpose of art is washing the dust of daily life off our souls.", author: "Pablo Picasso", year: "1923" },
  { text: "Others have seen what is and asked why. I have seen what could be and asked why not.", author: "Pablo Picasso", year: "1966" },
  { text: "Learn the rules like a pro, so you can break them like an artist.", author: "Pablo Picasso", year: "1957" },
  { text: "It takes a long time to become young.", author: "Pablo Picasso", year: "1965" },
  { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
  { text: "Art is the lie that enables us to realize the truth.", author: "Pablo Picasso", year: "1923" },
  { text: "Good artists copy, great artists steal.", author: "Pablo Picasso", year: "1920" },
  
  // Final wisdom to reach 1000 quotes
  { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero", year: "50 BC" },
  { text: "A happy life consists in tranquility of mind.", author: "Marcus Tullius Cicero", year: "44 BC" },
  { text: "The life of the dead is placed in the memory of the living.", author: "Marcus Tullius Cicero", year: "44 BC" },
  { text: "More is lost by indecision than wrong decision.", author: "Marcus Tullius Cicero", year: "50 BC" },
  { text: "Gratitude is not only the greatest of virtues, but the parent of all others.", author: "Marcus Tullius Cicero", year: "54 BC" },
  { text: "While there's life, there's hope.", author: "Marcus Tullius Cicero", year: "52 BC" },
  { text: "Any man can make mistakes, but only an idiot persists in his error.", author: "Marcus Tullius Cicero", year: "50 BC" },
  { text: "What is permissible is not always honorable.", author: "Marcus Tullius Cicero", year: "44 BC" },
  { text: "To live is to think.", author: "Marcus Tullius Cicero", year: "45 BC" },
  { text: "He only employs his passion who can make no use of his reason.", author: "Marcus Tullius Cicero", year: "50 BC" },
  
  // More Archimedes engineering wisdom
  { text: "Mathematics reveals its secrets only to those who approach it with pure love, for its own beauty.", author: "Archimedes" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch", year: "100" },
  
  // More ancient engineers and scholars
  { text: "It is the mark of an educated mind to rest satisfied with the degree of precision which the nature of the subject admits.", author: "Aristotle" },
  { text: "The worst form of inequality is to try to make unequal things equal.", author: "Aristotle" },
  { text: "Happiness is the meaning and the purpose of life, the whole aim and end of human existence.", author: "Aristotle" },
  { text: "All paid jobs absorb and degrade the mind.", author: "Aristotle" },
  { text: "The law is reason, free from passion.", author: "Aristotle" },
  { text: "Man is a goal seeking animal. His life only has meaning if he is reaching out and striving for his goals.", author: "Aristotle" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Suffering becomes beautiful when anyone bears great calamities with cheerfulness, not through insensibility but through greatness of mind.", author: "Aristotle" },
  
  // Final Leonardo gems
  { text: "Men of lofty genius when they are doing the least work are most active.", author: "Leonardo da Vinci" },
  { text: "The greatest deception men suffer is from their own opinions.", author: "Leonardo da Vinci" },
  { text: "Anyone who conducts an argument by appealing to authority is not using his intelligence; he is just using his memory.", author: "Leonardo da Vinci" },
  { text: "The acquisition of knowledge is always of use to the intellect, because it may thus drive out useless things and retain the good.", author: "Leonardo da Vinci" },
  { text: "Common Sense is that which judges the things given to it by other senses.", author: "Leonardo da Vinci" },
  
  // More Galileo
  { text: "Passion is the genesis of genius.", author: "Galileo Galilei" },
  { text: "It is surely harmful to souls to make it a heresy to believe what is proved.", author: "Galileo Galilei", year: "1615" },
  { text: "The book of nature is written in the language of mathematics.", author: "Galileo Galilei" },
  { text: "Wine is sunlight, held together by water.", author: "Galileo Galilei" },
  
  // More historical engineering wisdom
  { text: "The desire to know is natural to good men.", author: "Leonardo da Vinci" },
  { text: "Talent is a gift, but character is a choice.", author: "John C. Maxwell", year: "1993" },
  { text: "If you think you can do a thing or think you can't do a thing, you're right.", author: "Henry Ford" },
  { text: "The mediocre teacher tells. The good teacher explains. The superior teacher demonstrates. The great teacher inspires.", author: "William Arthur Ward", year: "1970" },
  
  // More Emerson
  { text: "What lies behind you and what lies in front of you, pales in comparison to what lies inside of you.", author: "Ralph Waldo Emerson" },
  { text: "The only way to have a friend is to be one.", author: "Ralph Waldo Emerson" },
  { text: "Do not waste yourself in rejection, nor bark against the bad, but chant the beauty of the good.", author: "Ralph Waldo Emerson" },
  { text: "Guard well your spare moments. They are like uncut diamonds.", author: "Ralph Waldo Emerson" },
  { text: "Without ambition one starts nothing. Without work one finishes nothing.", author: "Ralph Waldo Emerson" },
  { text: "A man is what he thinks about all day long.", author: "Ralph Waldo Emerson" },
  
  // More Thoreau
  { text: "Not until we are lost do we begin to understand ourselves.", author: "Henry David Thoreau" },
  { text: "As you simplify your life, the laws of the universe will be simpler.", author: "Henry David Thoreau" },
  { text: "The youth gets together his materials to build a bridge to the moon, or, perchance, a palace or temple on the earth, and, at length, the middle-aged man concludes to build a woodshed with them.", author: "Henry David Thoreau", year: "1854" },
  { text: "A man is rich in proportion to the number of things he can afford to let alone.", author: "Henry David Thoreau" },
  { text: "The question is not what you look at, but what you see.", author: "Henry David Thoreau" },
  { text: "Heaven is under our feet as well as over our heads.", author: "Henry David Thoreau", year: "1854" },
  
  // Final Engineering Proverbs
  { text: "Measure twice, cut once.", author: "Ancient Proverb" },
  { text: "A tool is but the extension of a man's hand.", author: "Henry Ward Beecher", year: "1887" },
  { text: "Give me the right tool and I can fix the world.", author: "Ancient Proverb" },
  { text: "The right tool for the right job.", author: "Ancient Proverb" },
  { text: "He who works with his hands is a laborer. He who works with his hands and his head is a craftsman. He who works with his hands and his head and his heart is an artist.", author: "Francis of Assisi", year: "1210" },
  { text: "The eye sees only what the mind is prepared to comprehend.", author: "Robertson Davies", year: "1985" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe", year: "1992" },
];

export const getRandomQuote = (): MakerQuote => {
  const randomIndex = Math.floor(Math.random() * makerQuotes.length);
  return makerQuotes[randomIndex];
};
