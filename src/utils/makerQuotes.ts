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

  // Wright Brothers
  { text: "It is possible to fly without motors, but not without knowledge and skill.", author: "Wilbur Wright", year: "1901" },
  { text: "The desire to fly is an idea handed down to us by our ancestors who looked enviously on the birds.", author: "Wilbur Wright" },
  { text: "I confess that in 1901 I said to my brother that man would not fly for fifty years.", author: "Wilbur Wright", year: "1908" },
  
  // Alexander Graham Bell
  { text: "Before anything else, preparation is the key to success.", author: "Alexander Graham Bell" },
  { text: "When one door closes, another opens; but we often look so long and so regretfully upon the closed door that we do not see the one which has opened for us.", author: "Alexander Graham Bell" },
  { text: "The inventor looks upon the world and is not contented with things as they are.", author: "Alexander Graham Bell" },

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
  
  // Additional 1000 quotes - Engineers, Scientists, Inventors, Makers (Pre-1995)
  
  // James Watt (Steam Engine Pioneer)
  { text: "The perfection of workmanship is the offspring of time and care.", author: "James Watt", year: "1785" },
  { text: "I can think of nothing else but this machine.", author: "James Watt", year: "1765" },
  { text: "Nature can be conquered only by obeying her.", author: "James Watt" },
  
  // George Stephenson (Railway Pioneer)
  { text: "I have always practiced what I preached.", author: "George Stephenson", year: "1840" },
  { text: "The locomotive is destined to change the face of the world.", author: "George Stephenson", year: "1825" },
  
  // Isambard Kingdom Brunel (Civil Engineer)
  { text: "I am opposed to the laying down of rules or conditions to be observed in the construction of bridges.", author: "Isambard Kingdom Brunel", year: "1850" },
  { text: "The most sublime efforts of philosophy are consistent with facts and reason.", author: "Isambard Kingdom Brunel" },
  
  // Michael Faraday (Physicist/Chemist)
  { text: "Nothing is too wonderful to be true if it be consistent with the laws of nature.", author: "Michael Faraday", year: "1849" },
  { text: "Work, finish, publish.", author: "Michael Faraday", year: "1830" },
  { text: "The five essential entrepreneurial skills are concentration, discrimination, organization, innovation and communication.", author: "Michael Faraday" },
  { text: "Lectures which really teach will never be popular; lectures which are popular will never really teach.", author: "Michael Faraday", year: "1860" },
  
  // Charles Babbage (Computing Pioneer)
  { text: "Errors using inadequate data are much less than those using no data at all.", author: "Charles Babbage", year: "1830" },
  { text: "At each increase of knowledge, as well as on the contrivance of every new tool, human labor becomes abridged.", author: "Charles Babbage", year: "1832" },
  { text: "The economy of human time is the next advantage of machinery in manufactures.", author: "Charles Babbage", year: "1832" },
  
  // Lord Kelvin (William Thomson - Physicist/Engineer)
  { text: "When you can measure what you are speaking about, and express it in numbers, you know something about it.", author: "Lord Kelvin", year: "1883" },
  { text: "If you cannot measure it, you cannot improve it.", author: "Lord Kelvin", year: "1891" },
  { text: "To measure is to know.", author: "Lord Kelvin", year: "1889" },
  { text: "There is nothing new to be discovered in physics now. All that remains is more and more precise measurement.", author: "Lord Kelvin", year: "1900" },
  { text: "I often say that when you can measure what you are speaking about, and express it in numbers, you know something about it.", author: "Lord Kelvin", year: "1883" },
  
  // James Clerk Maxwell (Physicist)
  { text: "The true logic of this world is in the calculus of probabilities.", author: "James Clerk Maxwell", year: "1850" },
  { text: "Thoroughly conscious ignorance is the prelude to every real advance in science.", author: "James Clerk Maxwell", year: "1871" },
  { text: "In every branch of knowledge the progress is proportional to the amount of facts on which to build.", author: "James Clerk Maxwell" },
  
  // Gustave Eiffel (Engineer)
  { text: "The tower will be the tallest edifice ever erected by man. Will it not be grandiose in its way?", author: "Gustave Eiffel", year: "1887" },
  { text: "I ought to be jealous of the tower. It is more famous than I am.", author: "Gustave Eiffel", year: "1900" },
  
  // Samuel Morse (Telegraph Inventor)
  { text: "What hath God wrought!", author: "Samuel Morse", year: "1844" },
  { text: "If the presence of electricity can be made visible in any part of the circuit, I see no reason why intelligence may not be transmitted instantaneously by electricity.", author: "Samuel Morse", year: "1837" },
  
  // George Washington Carver (Agricultural Scientist)
  { text: "Education is the key to unlock the golden door of freedom.", author: "George Washington Carver", year: "1920" },
  { text: "Where there is no vision, there is no hope.", author: "George Washington Carver", year: "1915" },
  { text: "When you do the common things in life in an uncommon way, you will command the attention of the world.", author: "George Washington Carver", year: "1910" },
  { text: "It is not the style of clothes one wears, neither the kind of automobile one drives, nor the amount of money one has in the bank, that counts.", author: "George Washington Carver" },
  { text: "How far you go in life depends on your being tender with the young, compassionate with the aged, sympathetic with the striving and tolerant of the weak and strong.", author: "George Washington Carver" },
  
  // Louis Pasteur (Chemist/Microbiologist)
  { text: "In the fields of observation chance favors only the prepared mind.", author: "Louis Pasteur", year: "1854" },
  { text: "Science knows no country, because knowledge belongs to humanity.", author: "Louis Pasteur", year: "1870" },
  { text: "Let me tell you the secret that has led to my goal: my strength lies solely in my tenacity.", author: "Louis Pasteur", year: "1880" },
  { text: "Fortune favors the prepared mind.", author: "Louis Pasteur", year: "1854" },
  
  // Marie Curie (Physicist/Chemist)
  { text: "Nothing in life is to be feared, it is only to be understood.", author: "Marie Curie", year: "1920" },
  { text: "Be less curious about people and more curious about ideas.", author: "Marie Curie", year: "1910" },
  { text: "I was taught that the way of progress was neither swift nor easy.", author: "Marie Curie", year: "1923" },
  { text: "One never notices what has been done; one can only see what remains to be done.", author: "Marie Curie", year: "1920" },
  { text: "Life is not easy for any of us. But what of that? We must have perseverance and above all confidence in ourselves.", author: "Marie Curie", year: "1920" },
  
  // Pierre Curie (Physicist)
  { text: "It is important to make a dream of life and to make a dream reality.", author: "Pierre Curie", year: "1900" },
  { text: "One must not be afraid of a little silence. Some find silence awkward or oppressive. But a relaxed approach to dialogue will include the welcoming of some silence.", author: "Pierre Curie" },
  
  // Ernest Rutherford (Physicist)
  { text: "All science is either physics or stamp collecting.", author: "Ernest Rutherford", year: "1908" },
  { text: "If your experiment needs statistics, you ought to have done a better experiment.", author: "Ernest Rutherford", year: "1920" },
  { text: "An alleged scientific discovery has no merit unless it can be explained to a barmaid.", author: "Ernest Rutherford", year: "1920" },
  
  // Max Planck (Physicist)
  { text: "An experiment is a question which science poses to Nature and a measurement is the recording of Nature's answer.", author: "Max Planck", year: "1933" },
  { text: "When you change the way you look at things, the things you look at change.", author: "Max Planck", year: "1920" },
  { text: "Science cannot solve the ultimate mystery of nature.", author: "Max Planck", year: "1932" },
  
  // Werner Heisenberg (Physicist)
  { text: "An expert is someone who knows some of the worst mistakes that can be made in his subject and how to avoid them.", author: "Werner Heisenberg", year: "1975" },
  { text: "Not only is the Universe stranger than we think, it is stranger than we can think.", author: "Werner Heisenberg", year: "1958" },
  { text: "What we observe is not nature itself, but nature exposed to our method of questioning.", author: "Werner Heisenberg", year: "1958" },
  
  // Niels Bohr (Physicist)
  { text: "An expert is a person who has made all the mistakes that can be made in a very narrow field.", author: "Niels Bohr", year: "1950" },
  { text: "Prediction is very difficult, especially about the future.", author: "Niels Bohr", year: "1948" },
  { text: "The opposite of a correct statement is a false statement. But the opposite of a profound truth may well be another profound truth.", author: "Niels Bohr", year: "1958" },
  { text: "Every great and deep difficulty bears in itself its own solution.", author: "Niels Bohr", year: "1930" },
  
  // Enrico Fermi (Physicist)
  { text: "There are two possible outcomes: if the result confirms the hypothesis, then you've made a measurement. If the result is contrary to the hypothesis, then you've made a discovery.", author: "Enrico Fermi", year: "1950" },
  { text: "Before I came here I was confused about this subject. Having listened to your lecture I am still confused. But on a higher level.", author: "Enrico Fermi", year: "1945" },
  
  // J. Robert Oppenheimer (Physicist)
  { text: "The optimist thinks this is the best of all possible worlds. The pessimist fears it is true.", author: "J. Robert Oppenheimer", year: "1960" },
  { text: "There are children playing in the streets who could solve some of my top problems in physics.", author: "J. Robert Oppenheimer", year: "1950" },
  { text: "In some sort of crude sense, which no vulgarity, no humor, no overstatement can quite extinguish, the physicists have known sin.", author: "J. Robert Oppenheimer", year: "1947" },
  
  // Richard Feynman (Physicist)
  { text: "I would rather have questions that can't be answered than answers that can't be questioned.", author: "Richard Feynman", year: "1985" },
  { text: "The first principle is that you must not fool yourself and you are the easiest person to fool.", author: "Richard Feynman", year: "1974" },
  { text: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.", author: "Richard Feynman", year: "1965" },
  { text: "I think it's much more interesting to live not knowing than to have answers which might be wrong.", author: "Richard Feynman", year: "1981" },
  { text: "Nature uses only the longest threads to weave her patterns, so that each small piece of her fabric reveals the organization of the entire tapestry.", author: "Richard Feynman", year: "1965" },
  { text: "If you thought that science was certain - well, that is just an error on your part.", author: "Richard Feynman", year: "1988" },
  { text: "Physics is like sex: sure, it may give some practical results, but that's not why we do it.", author: "Richard Feynman", year: "1975" },
  { text: "We are trying to prove ourselves wrong as quickly as possible, because only in that way can we find progress.", author: "Richard Feynman", year: "1965" },
  { text: "You have no responsibility to live up to what other people think you ought to accomplish.", author: "Richard Feynman", year: "1983" },
  { text: "Fall in love with some activity, and do it! Nobody ever figures out what life is all about, and it doesn't matter.", author: "Richard Feynman", year: "1981" },
  
  // Freeman Dyson (Physicist/Mathematician)
  { text: "A good scientist is a person with original ideas. A good engineer is a person who makes a design that works with as few original ideas as possible.", author: "Freeman Dyson", year: "1981" },
  { text: "Technology is a gift of God. After the gift of life it is perhaps the greatest of God's gifts.", author: "Freeman Dyson", year: "1988" },
  
  // John von Neumann (Mathematician/Physicist)
  { text: "If people do not believe that mathematics is simple, it is only because they do not realize how complicated life is.", author: "John von Neumann", year: "1947" },
  { text: "Anyone who attempts to generate random numbers by deterministic means is, of course, living in a state of sin.", author: "John von Neumann", year: "1951" },
  { text: "In mathematics you don't understand things. You just get used to them.", author: "John von Neumann", year: "1940" },
  { text: "There's no sense in being precise when you don't even know what you're talking about.", author: "John von Neumann", year: "1950" },
  
  // Alan Turing (Computer Scientist)
  { text: "Sometimes it is the people no one imagines anything of who do the things that no one can imagine.", author: "Alan Turing", year: "1950" },
  { text: "We can only see a short distance ahead, but we can see plenty there that needs to be done.", author: "Alan Turing", year: "1950" },
  { text: "A computer would deserve to be called intelligent if it could deceive a human into believing that it was human.", author: "Alan Turing", year: "1950" },
  { text: "Those who can imagine anything, can create the impossible.", author: "Alan Turing", year: "1945" },
  
  // Grace Hopper (Computer Scientist)
  { text: "The most dangerous phrase in the language is, 'We've always done it this way.'", author: "Grace Hopper", year: "1986" },
  { text: "If it's a good idea, go ahead and do it. It's much easier to apologize than it is to get permission.", author: "Grace Hopper", year: "1983" },
  { text: "To me programming is more than an important practical art. It is also a gigantic undertaking in the foundations of knowledge.", author: "Grace Hopper", year: "1952" },
  { text: "Leadership is a two-way street, loyalty up and loyalty down.", author: "Grace Hopper", year: "1980" },
  { text: "A ship in port is safe, but that's not what ships are built for.", author: "Grace Hopper", year: "1985" },
  
  // Claude Shannon (Information Theory Pioneer)
  { text: "I just wondered how things were put together.", author: "Claude Shannon", year: "1985" },
  { text: "Information is the resolution of uncertainty.", author: "Claude Shannon", year: "1948" },
  { text: "The fundamental problem of communication is that of reproducing at one point either exactly or approximately a message selected at another point.", author: "Claude Shannon", year: "1948" },
  
  // Norbert Wiener (Cybernetics Pioneer)
  { text: "The best material model of a cat is another, or preferably the same, cat.", author: "Norbert Wiener", year: "1950" },
  { text: "Progress imposes not only new possibilities for the future but new restrictions.", author: "Norbert Wiener", year: "1950" },
  { text: "To live effectively is to live with adequate information.", author: "Norbert Wiener", year: "1954" },
  
  // Vannevar Bush (Engineer)
  { text: "Fear cannot be banished, but it can be calm and without panic; it can be mitigated by reason and evaluation.", author: "Vannevar Bush", year: "1945" },
  { text: "To pursue science is not to disparage the things of the spirit.", author: "Vannevar Bush", year: "1945" },
  
  // Howard Aiken (Computer Pioneer)
  { text: "Don't worry about people stealing your ideas. If your ideas are any good, you'll have to ram them down people's throats.", author: "Howard Aiken", year: "1960" },
  { text: "The biggest advantage of cooperation is simply that one guy makes the decisions.", author: "Howard Aiken", year: "1963" },
  
  // Seymour Cray (Supercomputer Designer)
  { text: "Anyone can build a fast CPU. The trick is to build a fast system.", author: "Seymour Cray", year: "1985" },
  { text: "The trouble with programmers is that you can never tell what a programmer is doing until it's too late.", author: "Seymour Cray", year: "1980" },
  
  // Buckminster Fuller (Architect/Engineer)
  { text: "When I am working on a problem, I never think about beauty but when I have finished, if the solution is not beautiful, I know it is wrong.", author: "Buckminster Fuller", year: "1975" },
  { text: "You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete.", author: "Buckminster Fuller", year: "1969" },
  { text: "I'm not a genius. I'm just a tremendous bundle of experience.", author: "Buckminster Fuller", year: "1972" },
  { text: "There is nothing in a caterpillar that tells you it's going to be a butterfly.", author: "Buckminster Fuller", year: "1970" },
  { text: "Dare to be naive.", author: "Buckminster Fuller", year: "1975" },
  { text: "Don't fight forces, use them.", author: "Buckminster Fuller", year: "1960" },
  { text: "If you want to teach people a new way of thinking, don't bother trying to teach them. Instead, give them a tool, the use of which will lead to new ways of thinking.", author: "Buckminster Fuller", year: "1970" },
  
  // Jacques Cousteau (Marine Explorer/Inventor)
  { text: "The sea, once it casts its spell, holds one in its net of wonder forever.", author: "Jacques Cousteau", year: "1973" },
  { text: "When one man, for whatever reason, has the opportunity to lead an extraordinary life, he has no right to keep it to himself.", author: "Jacques Cousteau", year: "1975" },
  { text: "People protect what they love.", author: "Jacques Cousteau", year: "1985" },
  
  // Igor Sikorsky (Aviation Pioneer)
  { text: "The work of the individual still remains the spark that moves mankind ahead.", author: "Igor Sikorsky", year: "1950" },
  { text: "According to the laws of aerodynamics, the bumblebee can't fly either, but the bumblebee doesn't know anything about the laws of aerodynamics, so it goes ahead and flies anyway.", author: "Igor Sikorsky", year: "1930" },
  
  // Chuck Yeager (Test Pilot)
  { text: "You don't concentrate on risks. You concentrate on results. No risk is too great to prevent the necessary job from getting done.", author: "Chuck Yeager", year: "1990" },
  { text: "Rules are made for people who aren't willing to make up their own.", author: "Chuck Yeager", year: "1985" },
  
  // Wernher von Braun (Rocket Engineer)
  { text: "Research is what I'm doing when I don't know what I'm doing.", author: "Wernher von Braun", year: "1960" },
  { text: "I have learned to use the word 'impossible' with the greatest caution.", author: "Wernher von Braun", year: "1958" },
  { text: "We can lick gravity, but sometimes the paperwork is overwhelming.", author: "Wernher von Braun", year: "1965" },
  
  // Robert Goddard (Rocket Pioneer)
  { text: "It is difficult to say what is impossible, for the dream of yesterday is the hope of today and the reality of tomorrow.", author: "Robert Goddard", year: "1920" },
  { text: "Just remember - when you think all is lost, the future remains.", author: "Robert Goddard", year: "1932" },
  
  // George Gamow (Physicist)
  { text: "Physics is like sex: sure, it may give some practical results, but that's not why we do it.", author: "George Gamow", year: "1965" },
  { text: "The optimist believes we live in the best of all possible worlds. The pessimist fears this is true.", author: "George Gamow", year: "1960" },
  
  // Luis Alvarez (Physicist)
  { text: "There is no democracy in physics. We can't say that some second-rate guy has as much right to opinion as Fermi.", author: "Luis Alvarez", year: "1980" },
  { text: "I think of my lifetime in physics as divided into three periods.", author: "Luis Alvarez", year: "1987" },
  
  // Hans Bethe (Physicist)
  { text: "Science is not formal logic. The scientific method consists of proposing something and then waiting to be proven wrong.", author: "Hans Bethe", year: "1985" },
  { text: "To confine our attention to terrestrial matters would be to limit the human spirit.", author: "Hans Bethe", year: "1990" },
  
  // Murray Gell-Mann (Physicist)
  { text: "Think how hard physics would be if particles could think.", author: "Murray Gell-Mann", year: "1985" },
  { text: "Enthusiasm is followed by disappointment and even depression, and then by renewed enthusiasm.", author: "Murray Gell-Mann", year: "1994" },
  
  // Steven Weinberg (Physicist)
  { text: "The more the universe seems comprehensible, the more it also seems pointless.", author: "Steven Weinberg", year: "1977" },
  { text: "The effort to understand the universe is one of the very few things which lifts human life a little above the level of farce.", author: "Steven Weinberg", year: "1977" },
  
  // Carl Sagan (Astronomer/Scientist)
  { text: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan", year: "1980" },
  { text: "Science is a way of thinking much more than it is a body of knowledge.", author: "Carl Sagan", year: "1990" },
  { text: "If you wish to make an apple pie from scratch, you must first invent the universe.", author: "Carl Sagan", year: "1980" },
  { text: "Extraordinary claims require extraordinary evidence.", author: "Carl Sagan", year: "1980" },
  { text: "We are a way for the cosmos to know itself.", author: "Carl Sagan", year: "1980" },
  
  // Isaac Asimov (Scientist/Writer)
  { text: "The saddest aspect of life right now is that science gathers knowledge faster than society gathers wisdom.", author: "Isaac Asimov", year: "1988" },
  { text: "Self-education is, I firmly believe, the only kind of education there is.", author: "Isaac Asimov", year: "1991" },
  { text: "The most exciting phrase to hear in science is not 'Eureka!' but 'That's funny...'", author: "Isaac Asimov", year: "1974" },
  { text: "Life is pleasant. Death is peaceful. It's the transition that's troublesome.", author: "Isaac Asimov", year: "1989" },
  { text: "Violence is the last refuge of the incompetent.", author: "Isaac Asimov", year: "1951" },
  
  // Arthur C. Clarke (Scientist/Writer)
  { text: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke", year: "1962" },
  { text: "The only way to discover the limits of the possible is to go beyond them into the impossible.", author: "Arthur C. Clarke", year: "1973" },
  { text: "Two possibilities exist: either we are alone in the Universe or we are not. Both are equally terrifying.", author: "Arthur C. Clarke", year: "1980" },
  { text: "I don't pretend we have all the answers. But the questions are certainly worth thinking about.", author: "Arthur C. Clarke", year: "1968" },
  { text: "The limits of the possible can only be defined by going beyond them into the impossible.", author: "Arthur C. Clarke", year: "1962" },
  
  // Bertrand Russell (Mathematician/Philosopher)
  { text: "The good life is one inspired by love and guided by knowledge.", author: "Bertrand Russell", year: "1925" },
  { text: "Do not fear to be eccentric in opinion, for every opinion now accepted was once eccentric.", author: "Bertrand Russell", year: "1930" },
  { text: "The fundamental cause of trouble is that in the modern world the stupid are cocksure while the intelligent are full of doubt.", author: "Bertrand Russell", year: "1933" },
  { text: "Three passions have governed my life: The longings for love, the search for knowledge, and unbearable pity for the suffering of mankind.", author: "Bertrand Russell", year: "1967" },
  { text: "The whole problem with the world is that fools and fanatics are always so certain of themselves, and wiser people so full of doubts.", author: "Bertrand Russell", year: "1951" },
  
  // Alfred North Whitehead (Mathematician/Philosopher)
  { text: "Civilization advances by extending the number of important operations which we can perform without thinking about them.", author: "Alfred North Whitehead", year: "1911" },
  { text: "The art of progress is to preserve order amid change, and to preserve change amid order.", author: "Alfred North Whitehead", year: "1929" },
  { text: "It is more important that a proposition be interesting than that it be true.", author: "Alfred North Whitehead", year: "1938" },
  { text: "Seek simplicity, and distrust it.", author: "Alfred North Whitehead", year: "1919" },
  
  // David Hilbert (Mathematician)
  { text: "Physics is too hard for physicists.", author: "David Hilbert", year: "1920" },
  { text: "We must know, we will know.", author: "David Hilbert", year: "1930" },
  { text: "Mathematics knows no races or geographic boundaries; for mathematics, the cultural world is one country.", author: "David Hilbert", year: "1900" },
  
  // Henri Poincaré (Mathematician/Physicist)
  { text: "Science is built up of facts, as a house is built of stones; but an accumulation of facts is no more a science than a heap of stones is a house.", author: "Henri Poincaré", year: "1905" },
  { text: "It is far better to foresee even without certainty than not to foresee at all.", author: "Henri Poincaré", year: "1908" },
  { text: "Thought is only a flash between two long nights, but this flash is everything.", author: "Henri Poincaré", year: "1913" },
  { text: "The scientist does not study nature because it is useful; he studies it because he delights in it.", author: "Henri Poincaré", year: "1908" },
  
  // Paul Dirac (Physicist)
  { text: "Pick a flower on Earth and you move the farthest star.", author: "Paul Dirac", year: "1930" },
  { text: "In science one tries to tell people, in such a way as to be understood by everyone, something that no one ever knew before.", author: "Paul Dirac", year: "1975" },
  { text: "A great deal of my work is just playing with equations and seeing what they give.", author: "Paul Dirac", year: "1960" },
  { text: "The measure of greatness in a scientific idea is the extent to which it stimulates thought and opens up new lines of research.", author: "Paul Dirac", year: "1970" },
  
  // Erwin Schrödinger (Physicist)
  { text: "The task is not to see what has never been seen before, but to think what has never been thought before about what you see everyday.", author: "Erwin Schrödinger", year: "1944" },
  { text: "Consciousness cannot be accounted for in physical terms. For consciousness is absolutely fundamental.", author: "Erwin Schrödinger", year: "1944" },
  { text: "The scientist only imposes two things, namely truth and sincerity, imposes them upon himself and upon other scientists.", author: "Erwin Schrödinger", year: "1950" },
  
  // Wolfgang Pauli (Physicist)
  { text: "That is not only not right; it is not even wrong.", author: "Wolfgang Pauli", year: "1930" },
  { text: "God made the bulk; surfaces were invented by the devil.", author: "Wolfgang Pauli", year: "1950" },
  { text: "I don't mind your thinking slowly; I mind your publishing faster than you think.", author: "Wolfgang Pauli", year: "1945" },
  
  // Robert Oppenheimer (Additional)
  { text: "Both the man of science and the man of action live always at the edge of mystery.", author: "J. Robert Oppenheimer", year: "1953" },
  { text: "The best way to send information is to wrap it up in a person.", author: "J. Robert Oppenheimer", year: "1955" },
  
  // Leo Szilard (Physicist)
  { text: "A scientist's aim in a discussion with his colleagues is not to persuade, but to clarify.", author: "Leo Szilard", year: "1960" },
  { text: "If you want to succeed in the world you must make your own opportunities as you go on.", author: "Leo Szilard", year: "1950" },
  
  // Eugene Wigner (Physicist)
  { text: "The miracle of the appropriateness of the language of mathematics for the formulation of the laws of physics is a wonderful gift.", author: "Eugene Wigner", year: "1960" },
  { text: "The enormous usefulness of mathematics is something bordering on the mysterious.", author: "Eugene Wigner", year: "1960" },
  
  // Edward Teller (Physicist)
  { text: "Life improves slowly and goes wrong fast, and only catastrophe is clearly visible.", author: "Edward Teller", year: "1980" },
  { text: "Two paradoxes are better than one; they may even suggest a solution.", author: "Edward Teller", year: "1975" },
  
  // Harold Urey (Chemist)
  { text: "All of us have a little bit of 'I want to save the world' in us. It's okay if you only save one person, and it's okay if that person is you.", author: "Harold Urey", year: "1970" },
  { text: "Research is to see what everybody else has seen and think what nobody else has thought.", author: "Harold Urey", year: "1955" },
  
  // Linus Pauling (Chemist)
  { text: "The best way to have a good idea is to have lots of ideas.", author: "Linus Pauling", year: "1960" },
  { text: "Satisfaction of one's curiosity is one of the greatest sources of happiness in life.", author: "Linus Pauling", year: "1970" },
  { text: "If you want to have good ideas you must have many ideas. Most of them will be wrong, and what you have to learn is which ones to throw away.", author: "Linus Pauling", year: "1963" },
  { text: "Science is the search for truth - it is not a game in which one tries to beat his opponent.", author: "Linus Pauling", year: "1985" },
  
  // Glenn Seaborg (Chemist)
  { text: "The important thing in science is not so much to obtain new facts as to discover new ways of thinking about them.", author: "Glenn Seaborg", year: "1970" },
  { text: "People must understand that science is inherently neither a potential for good nor for evil.", author: "Glenn Seaborg", year: "1985" },
  
  // Dorothy Hodgkin (Chemist)
  { text: "I was captured for life by chemistry and by crystals.", author: "Dorothy Hodgkin", year: "1990" },
  { text: "I seem to have spent much of my life opening doors and looking at the surprises lying beyond.", author: "Dorothy Hodgkin", year: "1993" },
  
  // Rosalind Franklin (Chemist)
  { text: "Science and everyday life cannot and should not be separated.", author: "Rosalind Franklin", year: "1955" },
  { text: "You look at science as something very elite, which only a few people can learn. That's just not true.", author: "Rosalind Franklin", year: "1956" },
  
  // Rachel Carson (Marine Biologist)
  { text: "The more clearly we can focus our attention on the wonders and realities of the universe about us, the less taste we shall have for destruction.", author: "Rachel Carson", year: "1962" },
  { text: "In every outthrust headland, in every curving beach, in every grain of sand there is the story of the earth.", author: "Rachel Carson", year: "1951" },
  { text: "Those who contemplate the beauty of the earth find reserves of strength that will endure as long as life lasts.", author: "Rachel Carson", year: "1965" },
  
  // Barbara McClintock (Geneticist)
  { text: "I know my corn plants intimately, and I find it a great pleasure to know them.", author: "Barbara McClintock", year: "1983" },
  { text: "If you know you are on the right track, if you have this inner knowledge, then nobody can turn you off.", author: "Barbara McClintock", year: "1983" },
  
  // James Watson (Molecular Biologist)
  { text: "Science moves with the spirit of an adventure characterized both by youthful arrogance and by the belief that the truth, once found, would be simple as well as pretty.", author: "James Watson", year: "1968" },
  { text: "Nothing new that is really interesting comes without collaboration.", author: "James Watson", year: "1990" },
  
  // Francis Crick (Molecular Biologist)
  { text: "The dangerous man is the one who has only one idea, because then he'll fight and die for it.", author: "Francis Crick", year: "1988" },
  { text: "There is no form of prose more difficult to understand and more tedious to read than the average scientific paper.", author: "Francis Crick", year: "1994" },
  
  // Jonas Salk (Medical Researcher)
  { text: "The reward for work well done is the opportunity to do more.", author: "Jonas Salk", year: "1985" },
  { text: "There is hope in dreams, imagination, and in the courage of those who wish to make those dreams a reality.", author: "Jonas Salk", year: "1980" },
  { text: "Our greatest responsibility is to be good ancestors.", author: "Jonas Salk", year: "1990" },
  { text: "Hope lies in dreams, in imagination, and in the courage of those who dare to make dreams into reality.", author: "Jonas Salk", year: "1985" },
  
  // Frederick Banting (Medical Scientist)
  { text: "To give insulin to a diabetic is to give life.", author: "Frederick Banting", year: "1923" },
  { text: "Courage is the first of human qualities because it is the quality which guarantees all others.", author: "Frederick Banting", year: "1930" },
  
  // Alexander Fleming (Biologist)
  { text: "One sometimes finds what one is not looking for.", author: "Alexander Fleming", year: "1945" },
  { text: "When I woke up just after dawn on September 28, 1928, I certainly didn't plan to revolutionize all medicine.", author: "Alexander Fleming", year: "1945" },
  
  // William Harvey (Physician)
  { text: "All we know is still infinitely less than all that remains unknown.", author: "William Harvey", year: "1651" },
  { text: "Doctrine without experiment is but mere speculation.", author: "William Harvey", year: "1628" },
  
  // Andreas Vesalius (Anatomist)
  { text: "I am not accustomed to saying anything with certainty after only one or two observations.", author: "Andreas Vesalius", year: "1543" },
  { text: "The more I have learned from the things themselves, the more I have doubted the opinions of the ancients.", author: "Andreas Vesalius", year: "1543" },
  
  // Robert Boyle (Chemist/Physicist)
  { text: "Not few nor obscure are the wonders we have discovered in nature.", author: "Robert Boyle", year: "1661" },
  { text: "Nothing is so fatal to religion as indifference.", author: "Robert Boyle", year: "1665" },
  
  // Antoine Lavoisier (Chemist)
  { text: "In nature nothing is created, nothing is lost, everything changes.", author: "Antoine Lavoisier", year: "1789" },
  { text: "Nothing is lost, nothing is created, everything is transformed.", author: "Antoine Lavoisier", year: "1789" },
  
  // Joseph Priestley (Chemist)
  { text: "Every man, when he comes to be sensible of his natural rights, and to feel his own importance, will be disposed to respect the rights of others.", author: "Joseph Priestley", year: "1791" },
  { text: "The more elaborate our means of communication, the less we communicate.", author: "Joseph Priestley", year: "1794" },
  
  // Dmitri Mendeleev (Chemist)
  { text: "The elements, if arranged according to their atomic weights, exhibit an evident periodicity of properties.", author: "Dmitri Mendeleev", year: "1869" },
  { text: "There is nothing in this world that I fear to say.", author: "Dmitri Mendeleev", year: "1880" },
  
  // J.J. Thomson (Physicist)
  { text: "From the point of view of the physicist, a theory of matter is a policy rather than a creed.", author: "J.J. Thomson", year: "1907" },
  { text: "Could anything at first sight seem more impractical than a body which is so small that its mass is an insignificant fraction of the mass of an atom?", author: "J.J. Thomson", year: "1897" },
  
  // Wilhelm Röntgen (Physicist)
  { text: "I have discovered something interesting, but I do not know whether or not my observations are correct.", author: "Wilhelm Röntgen", year: "1895" },
  { text: "I did not think; I investigated.", author: "Wilhelm Röntgen", year: "1896" },
  
  // Henri Becquerel (Physicist)
  { text: "Discovery consists of seeing what everybody has seen and thinking what nobody has thought.", author: "Henri Becquerel", year: "1896" },
  { text: "One must trust in intuition to make discoveries.", author: "Henri Becquerel", year: "1903" },
  
  // Wilhelm Wien (Physicist)
  { text: "A new scientific truth does not triumph by convincing its opponents, but rather because its opponents eventually die.", author: "Wilhelm Wien", year: "1911" },
  { text: "Science advances one funeral at a time.", author: "Wilhelm Wien", year: "1915" },
  
  // Robert Millikan (Physicist)
  { text: "Cultivate the habit of attention and try to gain opportunities to hear wise men and women talk.", author: "Robert Millikan", year: "1935" },
  { text: "Science is not formal logic—it needs the free play of the mind in as great a degree as any other creative art.", author: "Robert Millikan", year: "1928" },
  
  // Arthur Compton (Physicist)
  { text: "Science can have no quarrel with a religion which postulates a God to whom men are His children.", author: "Arthur Compton", year: "1936" },
  { text: "My first feeling about the paper and the attitude is that it is absurd.", author: "Arthur Compton", year: "1923" },
  
  // James Chadwick (Physicist)
  { text: "The structure of the nucleus is a problem both difficult and obscure.", author: "James Chadwick", year: "1932" },
  { text: "I believe there is nothing more important in science than good teaching.", author: "James Chadwick", year: "1950" },
  
  // Percy Bridgman (Physicist)
  { text: "The scientific method, as far as it is a method, is nothing more than doing one's damnedest with one's mind, no holds barred.", author: "Percy Bridgman", year: "1950" },
  { text: "If a specific question has meaning, it must be possible to find operations by which answers may be given to it.", author: "Percy Bridgman", year: "1927" },
  
  // Arthur Eddington (Astrophysicist)
  { text: "Not only is the universe stranger than we imagine, it is stranger than we can imagine.", author: "Arthur Eddington", year: "1928" },
  { text: "We have found a strange footprint on the shores of the unknown.", author: "Arthur Eddington", year: "1928" },
  { text: "Something unknown is doing we don't know what.", author: "Arthur Eddington", year: "1933" },
  { text: "The electron: may it never be of any use to anybody!", author: "Arthur Eddington", year: "1932" },
  
  // Subrahmanyan Chandrasekhar (Astrophysicist)
  { text: "The pursuit of science has often been compared to the scaling of mountains, high and not so high.", author: "Subrahmanyan Chandrasekhar", year: "1975" },
  { text: "In science, there is only physics; all the rest is stamp collecting.", author: "Subrahmanyan Chandrasekhar", year: "1987" },
  
  // Edwin Hubble (Astronomer)
  { text: "Equipped with his five senses, man explores the universe around him and calls the adventure Science.", author: "Edwin Hubble", year: "1936" },
  { text: "I knew that even if I were second or third rate, it was astronomy that mattered.", author: "Edwin Hubble", year: "1948" },
  
  // Harlow Shapley (Astronomer)
  { text: "Some piously record 'In the beginning God,' but I say 'In the beginning hydrogen.'", author: "Harlow Shapley", year: "1960" },
  { text: "We have heard the ratios of all harmony; we have heard the vibrations of innumerable atoms.", author: "Harlow Shapley", year: "1943" },
  
  // Cecilia Payne-Gaposchkin (Astronomer)
  { text: "The reward of the young scientist is the emotional thrill of being the first person in the history of the world to see something or to understand something.", author: "Cecilia Payne-Gaposchkin", year: "1968" },
  { text: "Do not undertake a scientific career in quest of fame or money.", author: "Cecilia Payne-Gaposchkin", year: "1984" },
  
  // Vera Rubin (Astronomer)
  { text: "Science is competitive, aggressive, demanding. It is also imaginative, inspiring, uplifting.", author: "Vera Rubin", year: "1993" },
  { text: "Don't let anyone keep you down for silly reasons such as who you are, how you look, where you come from.", author: "Vera Rubin", year: "1990" },
  
  // Jocelyn Bell Burnell (Astrophysicist)
  { text: "I believe it should be possible for someone stricken with a serious and ultimately fatal illness to choose to die peacefully with medical help.", author: "Jocelyn Bell Burnell", year: "1993" },
  { text: "Science is a wonderful thing if one does not have to earn one's living at it.", author: "Jocelyn Bell Burnell", year: "1987" },
  
  // Jan Oort (Astronomer)
  { text: "I believe that God left us in a chaos that we are supposed to organize ourselves.", author: "Jan Oort", year: "1980" },
  { text: "The more we learn about the universe, the more questions we have.", author: "Jan Oort", year: "1975" },
  
  // George Ellery Hale (Astronomer)
  { text: "Like buried treasures, the outposts of the universe have beckoned to the adventurous.", author: "George Ellery Hale", year: "1922" },
  { text: "Starlight is the fossil record of the universe.", author: "George Ellery Hale", year: "1928" },
  

  // Gregor Mendel (Geneticist)
  { text: "The value and utility of any experiment are determined by the fitness of the material to the purpose for which it is used.", author: "Gregor Mendel", year: "1866" },
  { text: "My scientific studies have afforded me great gratification.", author: "Gregor Mendel", year: "1865" },
  
  // Thomas Hunt Morgan (Geneticist)
  { text: "One of the chief duties of the mathematician in acting as an adviser to scientists is to discourage them from expecting too much from mathematics.", author: "Thomas Hunt Morgan", year: "1935" },
  { text: "Within the period of human history we do not know of a single instance of the transformation of one species into another.", author: "Thomas Hunt Morgan", year: "1916" },
  
  // Hermann Muller (Geneticist)
  { text: "The gene as the basis of life.", author: "Hermann Muller", year: "1927" },

  // Jane Goodall (Primatologist)
  { text: "What you do makes a difference, and you have to decide what kind of difference you want to make.", author: "Jane Goodall", year: "1986" },
  { text: "The greatest danger to our future is apathy.", author: "Jane Goodall", year: "1990" },
  { text: "Only if we understand, will we care. Only if we care, will we help.", author: "Jane Goodall", year: "1993" },
  
  // Dian Fossey (Primatologist)
  { text: "When you realize the value of all life, you dwell less on what is past and concentrate more on the preservation of the future.", author: "Dian Fossey", year: "1983" },
  { text: "The man who kills the animals today is the man who kills the people who get in his way tomorrow.", author: "Dian Fossey", year: "1985" },
  
  // E.O. Wilson (Biologist)
  { text: "We are drowning in information, while starving for wisdom.", author: "E.O. Wilson", year: "1984" },
  { text: "If all mankind were to disappear, the world would regenerate back to the rich state of equilibrium that existed ten thousand years ago.", author: "E.O. Wilson", year: "1984" },
  { text: "The real problem of humanity is the following: we have paleolithic emotions, medieval institutions, and god-like technology.", author: "E.O. Wilson", year: "1993" },
  
  // Aldo Leopold (Ecologist)
  { text: "A thing is right when it tends to preserve the integrity, stability and beauty of the biotic community.", author: "Aldo Leopold", year: "1949" },
  { text: "We abuse land because we regard it as a commodity belonging to us.", author: "Aldo Leopold", year: "1949" },
  { text: "The last word in ignorance is the man who says of an animal or plant, 'What good is it?'", author: "Aldo Leopold", year: "1949" },
  
  // John Muir (Naturalist)
  { text: "When we try to pick out anything by itself, we find it hitched to everything else in the Universe.", author: "John Muir", year: "1911" },
  { text: "The mountains are calling and I must go.", author: "John Muir", year: "1873" },
  { text: "In every walk with nature one receives far more than he seeks.", author: "John Muir", year: "1918" },
  { text: "The clearest way into the Universe is through a forest wilderness.", author: "John Muir", year: "1890" },
  
  // Alexander von Humboldt (Naturalist/Explorer)
  { text: "Nature is a living whole.", author: "Alexander von Humboldt", year: "1845" },
  { text: "The most dangerous worldviews are the worldviews of those who have never viewed the world.", author: "Alexander von Humboldt", year: "1850" },
  
  // Alfred Wegener (Geophysicist)
  { text: "The forces which displace continents are the same as those which produce great fold-mountain ranges.", author: "Alfred Wegener", year: "1915" },
  { text: "Scientists still do not appear to understand sufficiently that all earth sciences must contribute evidence toward unveiling the state of our planet in earlier times.", author: "Alfred Wegener", year: "1929" },
  
  // Charles Lyell (Geologist)
  { text: "In the course of my inquiry, I was led to the conclusion that the present state of things on the surface of the earth is the result of slow and gradual changes.", author: "Charles Lyell", year: "1830" },
  { text: "The present is the key to the past.", author: "Charles Lyell", year: "1830" },
  
  // James Hutton (Geologist)
  { text: "The result, therefore, of our present inquiry is, that we find no vestige of a beginning, no prospect of an end.", author: "James Hutton", year: "1788" },
  { text: "We find no sign of a beginning - no prospect of an end.", author: "James Hutton", year: "1788" },
  
  // Harry Hess (Geologist)
  { text: "The sea floor is spreading.", author: "Harry Hess", year: "1962" },
  { text: "Geology is the study of pressure and time.", author: "Harry Hess", year: "1960" },

  // Claude Allegre (Geochemist)
  { text: "Science is the belief in the ignorance of experts.", author: "Claude Allegre", year: "1992" },
  { text: "Doubt is not a pleasant condition, but certainty is absurd.", author: "Claude Allegre", year: "1987" },
  
  // Harold Jeffreys (Geophysicist)
  { text: "Geology is the study of the succession of events in the history of the Earth.", author: "Harold Jeffreys", year: "1952" },
  { text: "It is the facts that matter, not the proofs.", author: "Harold Jeffreys", year: "1961" },
  
  // William Smith (Geologist)
  { text: "Organized fossils are to the naturalist as coins to the antiquary.", author: "William Smith", year: "1815" },
  { text: "Each stratum contains fossils peculiar to itself.", author: "William Smith", year: "1815" },
  
  // J. Tuzo Wilson (Geophysicist)
  { text: "The day of the expert is passing. The day of the educated person is coming.", author: "J. Tuzo Wilson", year: "1970" },
  { text: "Plate tectonics provides a framework for understanding almost all geologic processes.", author: "J. Tuzo Wilson", year: "1965" },
  
  // Maurice Ewing (Geophysicist)
  { text: "The floor of the sea is the roof of the underworld.", author: "Maurice Ewing", year: "1956" },
  { text: "The deep ocean basins are the most dynamic parts of the earth.", author: "Maurice Ewing", year: "1959" },
  
  // Louis Agassiz (Geologist/Zoologist)
  { text: "Every great scientific truth goes through three stages. First, people say it conflicts with the Bible. Next, they say it has been discovered before. Lastly, they say they always believed it.", author: "Louis Agassiz", year: "1850" },
  { text: "Study nature, not books.", author: "Louis Agassiz", year: "1850" },
  { text: "The glacier was God's great plough.", author: "Louis Agassiz", year: "1840" },
  
  // Additional Engineering Wisdom
  { text: "Measure with a micrometer, mark with chalk, cut with an axe.", author: "Engineering Proverb" },
  { text: "A good plan violently executed now is better than a perfect plan executed next week.", author: "George S. Patton", year: "1944" },
  { text: "Perfectionism is the voice of the oppressor.", author: "Anne Lamott", year: "1994" },
  { text: "Better is the enemy of good enough.", author: "Russian Proverb" },
  { text: "If it ain't broke, don't fix it.", author: "Bert Lance", year: "1977" },
  { text: "Keep it simple, stupid.", author: "Kelly Johnson", year: "1960" },
  { text: "When in doubt, make it stout.", author: "Engineering Proverb" },
  { text: "If you can't fix it with a hammer, you've got an electrical problem.", author: "Workshop Wisdom" },
  { text: "The right tool makes all the difference.", author: "Craftsman Proverb" },
  { text: "Measure twice, drill once.", author: "Carpenter's Wisdom" },
  { text: "Patience is the companion of wisdom.", author: "Saint Augustine", year: "400" },
  { text: "Small deeds done are better than great deeds planned.", author: "Peter Marshall", year: "1948" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu", year: "500 BC" },
  { text: "Well begun is half done.", author: "Aristotle", year: "350 BC" },
  { text: "Practice makes perfect.", author: "Ancient Proverb" },
  { text: "Experience is the teacher of all things.", author: "Julius Caesar", year: "50 BC" },
  { text: "Knowledge comes, but wisdom lingers.", author: "Alfred Lord Tennyson", year: "1842" },
  { text: "An ounce of action is worth a ton of theory.", author: "Friedrich Engels", year: "1878" },
  { text: "Ideas are easy. Implementation is hard.", author: "Guy Kawasaki", year: "1990" },
  { text: "Execution is the chariot of genius.", author: "William Blake", year: "1790" },
  { text: "Vision without execution is hallucination.", author: "Thomas Edison", year: "1910" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  
  // Additional Engineering, Science & Maker Quotes (Pre-1995)
  
  // Workshop & Craftsmanship Wisdom
  { text: "Give me six hours to chop down a tree and I will spend the first four sharpening the axe.", author: "Abraham Lincoln", year: "1860" },
  { text: "If you don't have time to do it right, when will you have time to do it over?", author: "John Wooden", year: "1970" },
  { text: "Striving for perfection is the greatest stopper there is. It's your excuse to yourself for not doing anything.", author: "John Updike", year: "1985" },
  { text: "Have no fear of perfection - you'll never reach it.", author: "Salvador Dalí", year: "1955" },
  { text: "Art is never finished, only abandoned.", author: "Leonardo da Vinci", year: "1500" },
  { text: "The details are not the details. They make the design.", author: "Charles Eames", year: "1970" },
  { text: "Design is thinking made visual.", author: "Saul Bass", year: "1985" },
  { text: "Good design is obvious. Great design is transparent.", author: "Joe Sparano", year: "1990" },
  { text: "Less, but better.", author: "Dieter Rams", year: "1980" },
  { text: "Good design is as little design as possible.", author: "Dieter Rams", year: "1980" },
  { text: "Form follows function.", author: "Louis Sullivan", year: "1896" },
  { text: "God is in the details.", author: "Ludwig Mies van der Rohe", year: "1950" },
  { text: "Simplicity is not the absence of clutter, that's a consequence. Simplicity is somehow essentially describing the purpose.", author: "Jonathan Ive", year: "1992" },
  { text: "Make everything as simple as possible, but not simpler.", author: "Albert Einstein", year: "1933" },
  
  // Albert Einstein (Additional Quotes)
  { text: "If I had an hour to solve a problem I'd spend 55 minutes thinking about the problem and 5 minutes thinking about solutions.", author: "Albert Einstein", year: "1950" },
  { text: "The important thing is not to stop questioning. Curiosity has its own reason for existence.", author: "Albert Einstein", year: "1955" },
  { text: "Learn from yesterday, live for today, hope for tomorrow. The important thing is not to stop questioning.", author: "Albert Einstein", year: "1949" },
  { text: "Life is like riding a bicycle. To keep your balance, you must keep moving.", author: "Albert Einstein", year: "1930" },
  { text: "If you can't explain it simply, you don't understand it well enough.", author: "Albert Einstein", year: "1935" },
  { text: "The only source of knowledge is experience.", author: "Albert Einstein", year: "1945" },
  { text: "Look deep into nature, and then you will understand everything better.", author: "Albert Einstein", year: "1951" },
  { text: "The measure of intelligence is the ability to change.", author: "Albert Einstein", year: "1945" },
  { text: "A clever person solves a problem. A wise person avoids it.", author: "Albert Einstein", year: "1940" },
  { text: "Anyone who has never made a mistake has never tried anything new.", author: "Albert Einstein", year: "1935" },
  { text: "The world as we have created it is a process of our thinking.", author: "Albert Einstein", year: "1946" },
  { text: "Weakness of attitude becomes weakness of character.", author: "Albert Einstein", year: "1950" },
  { text: "Logic will get you from A to B. Imagination will take you everywhere.", author: "Albert Einstein", year: "1929" },
  { text: "The true sign of intelligence is not knowledge but imagination.", author: "Albert Einstein", year: "1929" },
  { text: "Try not to become a man of success, but rather try to become a man of value.", author: "Albert Einstein", year: "1955" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein", year: "1935" },
  { text: "The only way to escape the corruptible effect of praise is to go on working.", author: "Albert Einstein", year: "1930" },
  { text: "Everybody is a genius. But if you judge a fish by its ability to climb a tree, it will live its whole life believing that it is stupid.", author: "Albert Einstein", year: "1935" },
  { text: "I speak to everyone in the same way, whether he is the garbage man or the president of the university.", author: "Albert Einstein", year: "1940" },
  { text: "When you are courting a nice girl an hour seems like a second. When you sit on a red-hot cinder a second seems like an hour. That's relativity.", author: "Albert Einstein", year: "1938" },
  { text: "The world is a dangerous place to live; not because of the people who are evil, but because of the people who don't do anything about it.", author: "Albert Einstein", year: "1950" },
  { text: "Great spirits have always encountered violent opposition from mediocre minds.", author: "Albert Einstein", year: "1940" },
  { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein", year: "1947" },
  { text: "Education is what remains after one has forgotten what one has learned in school.", author: "Albert Einstein", year: "1936" },
  { text: "If the facts don't fit the theory, change the facts.", author: "Albert Einstein", year: "1935" },
  { text: "Any fool can know. The point is to understand.", author: "Albert Einstein", year: "1940" },
  { text: "The difference between stupidity and genius is that genius has its limits.", author: "Albert Einstein", year: "1945" },
  { text: "Peace cannot be kept by force; it can only be achieved by understanding.", author: "Albert Einstein", year: "1950" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", year: "1950" },
  { text: "Reality is merely an illusion, albeit a very persistent one.", author: "Albert Einstein", year: "1950" },
  { text: "The pursuit of truth and beauty is a sphere of activity in which we are permitted to remain children all our lives.", author: "Albert Einstein", year: "1949" },
  { text: "A question that sometimes drives me hazy: am I or are the others crazy?", author: "Albert Einstein", year: "1948" },
  { text: "The hardest thing in the world to understand is the income tax.", author: "Albert Einstein", year: "1945" },
  { text: "Common sense is the collection of prejudices acquired by age eighteen.", author: "Albert Einstein", year: "1936" },
  { text: "The value of a man should be seen in what he gives and not in what he is able to receive.", author: "Albert Einstein", year: "1943" },
  { text: "Intellectual growth should commence at birth and cease only at death.", author: "Albert Einstein", year: "1955" },
  { text: "We cannot solve our problems with the same thinking we used when we created them.", author: "Albert Einstein", year: "1946" },
  { text: "The mind that opens to a new idea never returns to its original size.", author: "Albert Einstein", year: "1945" },
  { text: "A happy man is too satisfied with the present to dwell too much on the future.", author: "Albert Einstein", year: "1922" },
  { text: "If A is a success in life, then A equals x plus y plus z. Work is x; y is play; and z is keeping your mouth shut.", author: "Albert Einstein", year: "1950" },
  { text: "Anger dwells only in the bosom of fools.", author: "Albert Einstein", year: "1945" },
  { text: "I have no special talents. I am only passionately curious.", author: "Albert Einstein", year: "1952" },
  { text: "Small is the number of people who see with their eyes and think with their minds.", author: "Albert Einstein", year: "1940" },
  { text: "You can never solve a problem on the level on which it was created.", author: "Albert Einstein", year: "1946" },
  { text: "Not everything that counts can be counted, and not everything that can be counted counts.", author: "Albert Einstein", year: "1950" },
  { text: "Everything should be made as simple as possible, but not simpler.", author: "Albert Einstein", year: "1933" },
  { text: "Insanity: doing the same thing over and over again and expecting different results.", author: "Albert Einstein", year: "1935" },
  { text: "The only thing that interferes with my learning is my education.", author: "Albert Einstein", year: "1930" },
  { text: "Pure mathematics is, in its way, the poetry of logical ideas.", author: "Albert Einstein", year: "1950" },
  { text: "The release of atomic energy has not created a new problem. It has merely made more urgent the necessity of solving an existing one.", author: "Albert Einstein", year: "1946" },
  { text: "I live in that solitude which is painful in youth, but delicious in the years of maturity.", author: "Albert Einstein", year: "1940" },
  { text: "Joy in looking and comprehending is nature's most beautiful gift.", author: "Albert Einstein", year: "1950" },
  { text: "Once we accept our limits, we go beyond them.", author: "Albert Einstein", year: "1945" },
  { text: "If I were not a physicist, I would probably be a musician.", author: "Albert Einstein", year: "1929" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein", year: "1955" },
  { text: "Information is not knowledge.", author: "Albert Einstein", year: "1950" },
  { text: "Technological progress is like an axe in the hands of a pathological criminal.", author: "Albert Einstein", year: "1945" },
  { text: "The high destiny of the individual is to serve rather than to rule.", author: "Albert Einstein", year: "1949" },
  { text: "Without deep reflection one knows from daily life that one exists for other people.", author: "Albert Einstein", year: "1930" },
  { text: "The monotony and solitude of a quiet life stimulates the creative mind.", author: "Albert Einstein", year: "1930" },
  { text: "The secret to creativity is knowing how to hide your sources.", author: "Albert Einstein", year: "1935" },
  { text: "Only a life lived for others is a life worthwhile.", author: "Albert Einstein", year: "1932" },
  { text: "Few are those who see with their own eyes and feel with their own hearts.", author: "Albert Einstein", year: "1950" },
  
  // Isaac Newton (Additional)
  { text: "Tact is the art of making a point without making an enemy.", author: "Isaac Newton", year: "1700" },
  { text: "Truth is ever to be found in simplicity, and not in the multiplicity and confusion of things.", author: "Isaac Newton", year: "1700" },
  { text: "Plato is my friend — Aristotle is my friend — but my greatest friend is truth.", author: "Isaac Newton", year: "1690" },
  { text: "To explain all nature is too difficult a task for any one man or even for any one age.", author: "Isaac Newton", year: "1704" },
  { text: "We build too many walls and not enough bridges.", author: "Isaac Newton", year: "1705" },
  { text: "I can calculate the motion of heavenly bodies, but not the madness of people.", author: "Isaac Newton", year: "1720" },
  { text: "To me there has never been a higher source of earthly honor or distinction than that connected with advances in science.", author: "Isaac Newton", year: "1707" },
  { text: "What we know is a drop, what we don't know is an ocean.", author: "Isaac Newton", year: "1710" },
  { text: "Nature is pleased with simplicity. And nature is no dummy.", author: "Isaac Newton", year: "1704" },
  { text: "I do not know what I may appear to the world, but to myself I seem to have been only like a boy playing on the sea-shore.", author: "Isaac Newton", year: "1727" },
  { text: "Errors are not in the art but in the artificers.", author: "Isaac Newton", year: "1687" },
  { text: "This most beautiful system of the sun, planets, and comets, could only proceed from the counsel and dominion of an intelligent Being.", author: "Isaac Newton", year: "1687" },
  { text: "A man may imagine things that are false, but he can only understand things that are true.", author: "Isaac Newton", year: "1700" },
  { text: "It is the weight, not numbers of experiments that is to be regarded.", author: "Isaac Newton", year: "1687" },
  { text: "I keep the subject constantly before me and wait till the first dawnings open little by little into the full light.", author: "Isaac Newton", year: "1715" },
  { text: "Atheism is so senseless. When I look at the solar system, I see the earth at the right distance from the sun.", author: "Isaac Newton", year: "1692" },
  { text: "I was like a boy playing on the sea-shore, and diverting myself now and then finding a smoother pebble or a prettier shell than ordinary.", author: "Isaac Newton", year: "1727" },
  { text: "What goes up must come down.", author: "Isaac Newton", year: "1687" },
  
  // Galileo Galilei (Additional)
  { text: "All truths are easy to understand once they are discovered; the point is to discover them.", author: "Galileo Galilei", year: "1638" },
  { text: "I do not feel obliged to believe that the same God who has endowed us with sense, reason, and intellect has intended us to forgo their use.", author: "Galileo Galilei", year: "1615" },
  { text: "You cannot teach a man anything, you can only help him find it within himself.", author: "Galileo Galilei", year: "1632" },
  { text: "Where the senses fail us, reason must step in.", author: "Galileo Galilei", year: "1610" },
  { text: "Nature is relentless and unchangeable, and it is indifferent as to whether its hidden reasons and actions are understandable to man or not.", author: "Galileo Galilei", year: "1638" },
  { text: "In questions of science, the authority of a thousand is not worth the humble reasoning of a single individual.", author: "Galileo Galilei", year: "1632" },
  { text: "Mathematics is the language with which God has written the universe.", author: "Galileo Galilei", year: "1623" },
  { text: "Facts which at first seem improbable will, even on scant explanation, drop the cloak which has hidden them.", author: "Galileo Galilei", year: "1638" },
  { text: "We cannot teach people anything; we can only help them discover it within themselves.", author: "Galileo Galilei", year: "1632" },
  { text: "The laws of nature are written by the hand of God in the language of mathematics.", author: "Galileo Galilei", year: "1623" },
  { text: "Philosophy is written in this grand book, the universe, which stands continually open to our gaze.", author: "Galileo Galilei", year: "1623" },
  { text: "See now the power of truth; the same experiment which at first glance seemed to show one thing, when more carefully examined, assures us of the contrary.", author: "Galileo Galilei", year: "1638" },
  { text: "I have never met a man so ignorant that I couldn't learn something from him.", author: "Galileo Galilei", year: "1630" },
  { text: "Long experience has taught me this about the status of mankind with regard to matters requiring thought: the less people know and understand about them, the more positively they attempt to argue concerning them.", author: "Galileo Galilei", year: "1632" },
  { text: "It is surely a matter of common observation that those who know most of the subject are the most modest in their claims.", author: "Galileo Galilei", year: "1632" },
  { text: "The sun, with all those planets revolving around it and dependent on it, can still ripen a bunch of grapes as if it had nothing else in the universe to do.", author: "Galileo Galilei", year: "1610" },
  { text: "And yet it moves.", author: "Galileo Galilei", year: "1633" },
  { text: "The Milky Way is nothing else but a mass of innumerable stars planted together in clusters.", author: "Galileo Galilei", year: "1610" },
  { text: "I think that in the discussion of natural problems we ought to begin not with the Scriptures, but with experiments.", author: "Galileo Galilei", year: "1615" },
  { text: "Infinity is a fathomless gulf, into which all things vanish.", author: "Galileo Galilei", year: "1638" },
  
  // Johannes Kepler (Astronomer)
  { text: "Nature uses as little as possible of anything.", author: "Johannes Kepler", year: "1619" },
  { text: "The diversity of the phenomena of nature is so great, and the treasures hidden in the heavens so rich, precisely in order that the human mind shall never be lacking in fresh nourishment.", author: "Johannes Kepler", year: "1609" },
  { text: "I much prefer the sharpest criticism of a single intelligent man to the thoughtless approval of the masses.", author: "Johannes Kepler", year: "1610" },
  { text: "Truth is the daughter of time, and I feel no shame in being her midwife.", author: "Johannes Kepler", year: "1609" },
  { text: "Geometry has two great treasures; one is the Theorem of Pythagoras; the other, the division of a line into extreme and mean ratio. The first we may compare to a measure of gold; the second we may name a precious jewel.", author: "Johannes Kepler", year: "1619" },
  { text: "Where there is matter, there is geometry.", author: "Johannes Kepler", year: "1619" },
  { text: "I demonstrate by means of philosophy that the earth is round, and is inhabited on all sides.", author: "Johannes Kepler", year: "1611" },
  { text: "The roads by which men arrive at their insights into celestial matters seems to me almost as worthy of wonder as those matters in themselves.", author: "Johannes Kepler", year: "1609" },
  
  // Blaise Pascal (Mathematician/Physicist)
  { text: "All of humanity's problems stem from man's inability to sit quietly in a room alone.", author: "Blaise Pascal", year: "1670" },
  { text: "We know the truth, not only by the reason, but also by the heart.", author: "Blaise Pascal", year: "1670" },
  { text: "Kind words do not cost much. Yet they accomplish much.", author: "Blaise Pascal", year: "1670" },
  { text: "The heart has its reasons which reason knows not.", author: "Blaise Pascal", year: "1670" },
  { text: "In faith there is enough light for those who want to believe and enough shadows to blind those who don't.", author: "Blaise Pascal", year: "1670" },
  { text: "Man is equally incapable of seeing the nothingness from which he emerges and the infinity in which he is engulfed.", author: "Blaise Pascal", year: "1670" },
  { text: "Justice without force is powerless; force without justice is tyrannical.", author: "Blaise Pascal", year: "1670" },
  { text: "The eternal silence of these infinite spaces frightens me.", author: "Blaise Pascal", year: "1670" },
  { text: "We are generally the better persuaded by the reasons we discover ourselves than by those given to us by others.", author: "Blaise Pascal", year: "1670" },
  { text: "Man's greatness lies in his power of thought.", author: "Blaise Pascal", year: "1670" },
  { text: "I have made this letter longer than usual because I lack the time to make it shorter.", author: "Blaise Pascal", year: "1657" },
  { text: "Contradiction is not a sign of falsity, nor the lack of contradiction a sign of truth.", author: "Blaise Pascal", year: "1670" },
  { text: "We sail within a vast sphere, ever drifting in uncertainty.", author: "Blaise Pascal", year: "1670" },
  { text: "Men never do evil so completely and cheerfully as when they do it from religious conviction.", author: "Blaise Pascal", year: "1670" },
  { text: "Truth is so obscure in these times, and falsehood so established, that, unless we love the truth, we cannot know it.", author: "Blaise Pascal", year: "1670" },
  { text: "All men's miseries derive from not being able to sit in a quiet room alone.", author: "Blaise Pascal", year: "1670" },
  { text: "The least movement is of importance to all nature. The entire ocean is affected by a pebble.", author: "Blaise Pascal", year: "1670" },
  { text: "The more I see of man, the more I like dogs.", author: "Blaise Pascal", year: "1670" },
  { text: "Do you wish people to think well of you? Don't speak well of yourself.", author: "Blaise Pascal", year: "1670" },
  { text: "Small minds are concerned with the extraordinary, great minds with the ordinary.", author: "Blaise Pascal", year: "1670" },
  
  // Archimedes (Additional)
  { text: "The shortest distance between two points is a straight line.", author: "Archimedes", year: "250 BC" },
  { text: "There are things which seem incredible to most men who have not studied mathematics.", author: "Archimedes", year: "250 BC" },
  { text: "Give me but a firm spot on which to stand, and I shall move the earth.", author: "Archimedes", year: "250 BC" },
  
  // Pythagoras (Mathematician)
  { text: "Do not say a little in many words but a great deal in a few.", author: "Pythagoras", year: "500 BC" },
  { text: "Choose always the way that seems the best, however rough it may be; custom will soon render it easy and agreeable.", author: "Pythagoras", year: "500 BC" },
  { text: "Silence is better than unmeaning words.", author: "Pythagoras", year: "500 BC" },
  { text: "There is geometry in the humming of the strings.", author: "Pythagoras", year: "500 BC" },
  { text: "Number rules the universe.", author: "Pythagoras", year: "500 BC" },
  { text: "Thought is an Idea in transit, which when once released, never can be lured back.", author: "Pythagoras", year: "500 BC" },
  { text: "Educate the children and it won't be necessary to punish the men.", author: "Pythagoras", year: "500 BC" },
  { text: "Rest satisfied with doing well, and leave others to talk of you as they please.", author: "Pythagoras", year: "500 BC" },
  { text: "Concern should drive us into action, not into a depression.", author: "Pythagoras", year: "500 BC" },
  { text: "Above all things, respect yourself.", author: "Pythagoras", year: "500 BC" },
  { text: "Be silent or let thy words be worth more than silence.", author: "Pythagoras", year: "500 BC" },
  { text: "Do not talk a little on many subjects, but much on a few.", author: "Pythagoras", year: "500 BC" },
  { text: "No man is free who cannot command himself.", author: "Pythagoras", year: "500 BC" },
  { text: "A thought is an idea in transit.", author: "Pythagoras", year: "500 BC" },
  
  // Euclid (Mathematician)
  { text: "There is no royal road to geometry.", author: "Euclid", year: "300 BC" },
  { text: "The laws of nature are but the mathematical thoughts of God.", author: "Euclid", year: "300 BC" },
  { text: "That which is equal to the same thing are equal to one another.", author: "Euclid", year: "300 BC" },
  { text: "The whole is greater than the part.", author: "Euclid", year: "300 BC" },
  
  // Carl Friedrich Gauss (Mathematician)
  { text: "Mathematics is the queen of sciences and number theory is the queen of mathematics.", author: "Carl Friedrich Gauss", year: "1832" },
  { text: "Finally, two days ago, I succeeded not on account of my hard efforts, but by the grace of the Lord.", author: "Carl Friedrich Gauss", year: "1796" },
  { text: "I have had my results for a long time, but I do not yet know how I am to arrive at them.", author: "Carl Friedrich Gauss", year: "1810" },
  { text: "It is not knowledge, but the act of learning, not possession but the act of getting there, which grants the greatest enjoyment.", author: "Carl Friedrich Gauss", year: "1808" },
  { text: "When a philosopher says something that is true then it is trivial. When he says something that is not trivial then it is false.", author: "Carl Friedrich Gauss", year: "1820" },
  { text: "You know that I write slowly. This is chiefly because I am never satisfied until I have said as much as possible in a few words.", author: "Carl Friedrich Gauss", year: "1830" },
  { text: "Few, but ripe.", author: "Carl Friedrich Gauss", year: "1840" },
  { text: "Life stands before me like an eternal spring with new and brilliant clothes.", author: "Carl Friedrich Gauss", year: "1796" },
  
  // Leonhard Euler (Mathematician)
  { text: "Although to penetrate into the intimate mysteries of nature and thence to learn the true causes of phenomena is not allowed to us, nevertheless it can happen that a certain fictive hypothesis may suffice for explaining many phenomena.", author: "Leonhard Euler", year: "1750" },
  { text: "Nothing takes place in the world whose meaning is not that of some maximum or minimum.", author: "Leonhard Euler", year: "1744" },
  { text: "Mathematicians have tried in vain to this day to discover some order in the sequence of prime numbers, and we have reason to believe that it is a mystery into which the human mind will never penetrate.", author: "Leonhard Euler", year: "1748" },
  { text: "To those who ask what the infinitely small quantity in mathematics is, we answer that it is actually zero.", author: "Leonhard Euler", year: "1755" },
  
  // Pierre-Simon Laplace (Mathematician/Astronomer)
  { text: "What we know is not much. What we do not know is immense.", author: "Pierre-Simon Laplace", year: "1827" },
  { text: "Probability theory is nothing but common sense reduced to calculation.", author: "Pierre-Simon Laplace", year: "1814" },
  { text: "It is India that gave us the ingenious method of expressing all numbers by means of ten symbols.", author: "Pierre-Simon Laplace", year: "1820" },
  { text: "The present state of the system of nature is evidently a consequence of what it was in the preceding moment.", author: "Pierre-Simon Laplace", year: "1814" },
  { text: "All the effects of nature are only mathematical results of a small number of immutable laws.", author: "Pierre-Simon Laplace", year: "1796" },
  
  // Joseph-Louis Lagrange (Mathematician)
  { text: "As long as algebra and geometry have been separated, their progress have been slow and their uses limited.", author: "Joseph-Louis Lagrange", year: "1788" },
  { text: "The reader will find no figures in this work.", author: "Joseph-Louis Lagrange", year: "1788" },
  
  // Gottfried Wilhelm Leibniz (Mathematician/Philosopher)
  { text: "Music is the pleasure the human mind experiences from counting without being aware that it is counting.", author: "Gottfried Wilhelm Leibniz", year: "1712" },
  { text: "The present is big with the future.", author: "Gottfried Wilhelm Leibniz", year: "1710" },
  { text: "To love is to find pleasure in the happiness of others.", author: "Gottfried Wilhelm Leibniz", year: "1710" },
  { text: "He who understands baboon would do more towards metaphysics than Locke.", author: "Gottfried Wilhelm Leibniz", year: "1715" },
  { text: "There are also two kinds of truths: truth of reasoning and truths of fact.", author: "Gottfried Wilhelm Leibniz", year: "1714" },
  { text: "Nature never makes leaps.", author: "Gottfried Wilhelm Leibniz", year: "1704" },
  { text: "Taking mathematics from the beginning of the world to the time when Newton lived, what he had done was much the better half.", author: "Gottfried Wilhelm Leibniz", year: "1716" },
  
  // René Descartes (Philosopher/Mathematician)
  { text: "I think; therefore I am.", author: "René Descartes", year: "1637" },
  { text: "The reading of all good books is like a conversation with the finest minds of past centuries.", author: "René Descartes", year: "1637" },
  { text: "Divide each difficulty into as many parts as is feasible and necessary to resolve it.", author: "René Descartes", year: "1637" },
  { text: "It is not enough to have a good mind; the main thing is to use it well.", author: "René Descartes", year: "1637" },
  { text: "Perfect numbers like perfect men are very rare.", author: "René Descartes", year: "1638" },
  { text: "If you would be a real seeker after truth, it is necessary that at least once in your life you doubt, as far as possible, all things.", author: "René Descartes", year: "1641" },
  { text: "The greatest minds are capable of the greatest vices as well as of the greatest virtues.", author: "René Descartes", year: "1637" },
  { text: "Doubt is the origin of wisdom.", author: "René Descartes", year: "1641" },
  { text: "Each problem that I solved became a rule, which served afterwards to solve other problems.", author: "René Descartes", year: "1637" },
  { text: "The first precept was never to accept a thing as true until I knew it as such without a single doubt.", author: "René Descartes", year: "1637" },
  { text: "Common sense is the most widely shared commodity in the world, for every man is convinced that he is well supplied with it.", author: "René Descartes", year: "1637" },
  { text: "Everything is self-evident.", author: "René Descartes", year: "1640" },
  { text: "An optimist may see a light where there is none, but why must the pessimist always run to blow it out?", author: "René Descartes", year: "1637" },
  { text: "I am indeed amazed when I consider how weak my mind is and how prone to error.", author: "René Descartes", year: "1641" },
  { text: "Travelling is almost like talking with those of other centuries.", author: "René Descartes", year: "1637" },
  
  // More Workshop Wisdom
  { text: "A dull tool is harder to use and more dangerous than a sharp one.", author: "Carpenter's Wisdom" },
  { text: "Never force anything. If it doesn't fit, you're doing it wrong.", author: "Workshop Proverb" },
  { text: "The wood teaches how it wants to be carved.", author: "Woodworking Wisdom" },
  { text: "Leave it better than you found it.", author: "Craftsman's Code" },
  { text: "The tool does not make the craftsman, but it helps.", author: "Ancient Proverb" },
  { text: "Haste makes waste.", author: "Ancient Proverb" },
  { text: "Slow is smooth, and smooth is fast.", author: "Military Wisdom", year: "1950" },
  { text: "If you're not making dust, you're collecting it.", author: "Workshop Humor" },
  { text: "The secret to a good finish is in the preparation.", author: "Finishing Wisdom" },
  { text: "Glue is not a structural member.", author: "Engineering Humor" },
  { text: "WD-40 for things that move but shouldn't. Duct tape for things that don't move but should.", author: "Workshop Wisdom" },
  { text: "The difference between screwing around and science is writing it down.", author: "Adam Savage", year: "1990" },
  { text: "When all else fails, read the instructions.", author: "Modern Proverb" },
  { text: "Safety third.", author: "Mike Rowe", year: "1994" },
  { text: "There's a fine line between a hobby and mental illness.", author: "Dave Barry", year: "1990" },
  { text: "Buy once, cry once.", author: "Tool-Buying Wisdom" },
  { text: "You can never have too many clamps.", author: "Woodworking Truth" },
  { text: "The difference between professional and amateur is consistency.", author: "Craftsman's Wisdom" },
  { text: "If it's stupid but it works, it isn't stupid.", author: "Engineering Proverb" },
  { text: "Any tool is a hammer if you use it wrong enough.", author: "Workshop Humor" },
  { text: "The project isn't done until the shop is clean.", author: "Workshop Rule" },
  { text: "Red goes to red, black goes to black, and green goes to ground.", author: "Electrician's Mantra" },
  { text: "Test before you trust.", author: "Electrician's Wisdom" },
  { text: "Lefty loosey, righty tighty.", author: "Mechanic's Rhyme" },
  { text: "If you can't loosen it, tighten it until it breaks, then it will be easy to remove.", author: "Mechanic's Joke" },
  { text: "The solution to any problem is usually simpler than you think.", author: "Problem-Solving Wisdom" },
  { text: "Start with the simplest explanation.", author: "Occam's Razor", year: "1320" },
  { text: "Everything works until you turn it on.", author: "Murphy's Law" },
  { text: "Anything that can go wrong will go wrong.", author: "Murphy's Law", year: "1949" },
  { text: "If anything simply cannot go wrong, it will anyway.", author: "Murphy's Law", year: "1949" },
  { text: "Left to themselves, things tend to go from bad to worse.", author: "Murphy's Law", year: "1949" },
  { text: "Nothing is as easy as it looks.", author: "Murphy's Law", year: "1949" },
  { text: "Everything takes longer than you think.", author: "Murphy's Law", year: "1949" },
  { text: "If there is a possibility of several things going wrong, the one that will cause the most damage will be the one to go wrong.", author: "Murphy's Law", year: "1949" },
  { text: "Mother Nature is a bitch.", author: "Murphy's Law", year: "1949" },
  { text: "It is impossible to make anything foolproof because fools are so ingenious.", author: "Murphy's Law", year: "1949" },
  { text: "Every solution breeds new problems.", author: "Murphy's Law", year: "1949" },
  
  // Blaise Pascal (Mathematician/Physicist)
  { text: "All of humanity's problems stem from man's inability to sit quietly in a room alone.", author: "Blaise Pascal", year: "1670" },
  { text: "In faith there is enough light for those who want to believe and enough shadows to blind those who don't.", author: "Blaise Pascal", year: "1670" },
  { text: "Truth is so obscure in these times, and falsehood so established, that, unless we love the truth, we cannot know it.", author: "Blaise Pascal", year: "1670" },
  { text: "Small minds are concerned with the extraordinary, great minds with the ordinary.", author: "Blaise Pascal", year: "1670" },
  { text: "Kind words do not cost much. Yet they accomplish much.", author: "Blaise Pascal", year: "1670" },
  { text: "People almost invariably arrive at their beliefs not on the basis of proof but on the basis of what they find attractive.", author: "Blaise Pascal", year: "1670" },
  { text: "We know the truth, not only by the reason, but also by the heart.", author: "Blaise Pascal", year: "1670" },
  { text: "Nothing is so intolerable to man as being fully at rest, without a passion, without business, without entertainment, without care.", author: "Blaise Pascal", year: "1670" },
  
  // Carl Friedrich Gauss (Mathematician)
  { text: "Mathematics is the queen of the sciences.", author: "Carl Friedrich Gauss", year: "1856" },
  { text: "It is not knowledge, but the act of learning, not possession but the act of getting there, which grants the greatest enjoyment.", author: "Carl Friedrich Gauss", year: "1808" },
  { text: "I have had my results for a long time: but I do not yet know how I am to arrive at them.", author: "Carl Friedrich Gauss", year: "1830" },
  { text: "When a philosopher says something that is true then it is trivial. When he says something that is not trivial then it is false.", author: "Carl Friedrich Gauss", year: "1840" },
  
  // Leonhard Euler (Mathematician)
  { text: "For since the fabric of the universe is most perfect and the work of a most wise Creator, nothing at all takes place in the universe in which some rule of maximum or minimum does not appear.", author: "Leonhard Euler", year: "1744" },
  { text: "Although to penetrate into the intimate mysteries of nature and thence to learn the true causes of phenomena is not allowed to us, nevertheless it can happen that a certain fictive hypothesis may suffice for explaining many phenomena.", author: "Leonhard Euler", year: "1750" },
  { text: "Nothing takes place in the world whose meaning is not that of some maximum or minimum.", author: "Leonhard Euler", year: "1744" },
  { text: "Now I will have less distraction.", author: "Leonhard Euler", year: "1738" },
  
  // Bernhard Riemann (Mathematician)
  { text: "If only I had the theorems! Then I should find the proofs easily enough.", author: "Bernhard Riemann", year: "1860" },
  
  // Georg Cantor (Mathematician)
  { text: "The essence of mathematics lies in its freedom.", author: "Georg Cantor", year: "1883" },
  { text: "In mathematics the art of proposing a question must be held of higher value than solving it.", author: "Georg Cantor", year: "1867" },
  { text: "A set is a Many that allows itself to be thought of as a One.", author: "Georg Cantor", year: "1895" },
  
  // David Hilbert (Mathematician)
  { text: "We must know. We will know.", author: "David Hilbert", year: "1930" },
  { text: "Mathematics is a game played according to certain simple rules with meaningless marks on paper.", author: "David Hilbert", year: "1925" },
  { text: "The art of doing mathematics consists in finding that special case which contains all the germs of generality.", author: "David Hilbert", year: "1900" },
  { text: "A mathematical theory is not to be considered complete until you have made it so clear that you can explain it to the first man whom you meet on the street.", author: "David Hilbert", year: "1900" },
  { text: "Physics is too hard for physicists.", author: "David Hilbert", year: "1920" },
  
  // Henri Poincaré (Mathematician)
  { text: "Mathematics is the art of giving the same name to different things.", author: "Henri Poincaré", year: "1908" },
  { text: "It is by logic we prove, it is by intuition that we invent.", author: "Henri Poincaré", year: "1905" },
  { text: "Science is built up of facts, as a house is built of stones; but an accumulation of facts is no more a science than a heap of stones is a house.", author: "Henri Poincaré", year: "1902" },
  { text: "The scientist does not study nature because it is useful; he studies it because he delights in it, and he delights in it because it is beautiful.", author: "Henri Poincaré", year: "1908" },
  { text: "Thought is only a flash between two long nights, but this flash is everything.", author: "Henri Poincaré", year: "1908" },
  { text: "Mathematicians are born, not made.", author: "Henri Poincaré", year: "1908" },
  { text: "Doubt everything or believe everything: these are two equally convenient strategies. With either we dispense with the need to think.", author: "Henri Poincaré", year: "1902" },
  
  // John von Neumann (Mathematician/Physicist)
  { text: "In mathematics you don't understand things. You just get used to them.", author: "John von Neumann", year: "1950" },
  { text: "If people do not believe that mathematics is simple, it is only because they do not realize how complicated life is.", author: "John von Neumann", year: "1947" },
  { text: "Young man, in mathematics you don't understand things. You just get used to them.", author: "John von Neumann", year: "1945" },
  { text: "Anyone who attempts to generate random numbers by deterministic means is, of course, living in a state of sin.", author: "John von Neumann", year: "1951" },
  { text: "There's no sense in being precise when you don't even know what you're talking about.", author: "John von Neumann", year: "1950" },
  { text: "The sciences do not try to explain, they hardly even try to interpret, they mainly make models.", author: "John von Neumann", year: "1955" },
  
  // Bertrand Russell (Philosopher/Mathematician)
  { text: "The only thing that will redeem mankind is cooperation.", author: "Bertrand Russell", year: "1950" },
  { text: "The good life is one inspired by love and guided by knowledge.", author: "Bertrand Russell", year: "1925" },
  { text: "The whole problem with the world is that fools and fanatics are always so certain of themselves, and wiser people so full of doubts.", author: "Bertrand Russell", year: "1933" },
  { text: "Three passions, simple but overwhelmingly strong, have governed my life: the longing for love, the search for knowledge, and unbearable pity for the suffering of mankind.", author: "Bertrand Russell", year: "1967" },
  { text: "Do not fear to be eccentric in opinion, for every opinion now accepted was once eccentric.", author: "Bertrand Russell", year: "1950" },
  { text: "The greatest challenge to any thinker is stating the problem in a way that will allow a solution.", author: "Bertrand Russell", year: "1945" },
  { text: "The fundamental cause of the trouble is that in the modern world the stupid are cocksure while the intelligent are full of doubt.", author: "Bertrand Russell", year: "1933" },
  { text: "To be without some of the things you want is an indispensable part of happiness.", author: "Bertrand Russell", year: "1930" },
  { text: "Men are born ignorant, not stupid. They are made stupid by education.", author: "Bertrand Russell", year: "1950" },
  
  // Alfred North Whitehead (Mathematician/Philosopher)
  { text: "Civilization advances by extending the number of important operations which we can perform without thinking about them.", author: "Alfred North Whitehead", year: "1911" },
  { text: "It is the business of the future to be dangerous.", author: "Alfred North Whitehead", year: "1925" },
  { text: "Not ignorance, but ignorance of ignorance, is the death of knowledge.", author: "Alfred North Whitehead", year: "1929" },
  { text: "We think in generalities, but we live in detail.", author: "Alfred North Whitehead", year: "1925" },
  { text: "Seek simplicity and distrust it.", author: "Alfred North Whitehead", year: "1919" },
  { text: "The art of progress is to preserve order amid change, and to preserve change amid order.", author: "Alfred North Whitehead", year: "1929" },
  
  // Kurt Gödel (Mathematician/Logician)
  { text: "I don't believe in natural science.", author: "Kurt Gödel", year: "1970" },
  
  // Alan Turing (Mathematician/Computer Scientist)
  { text: "We can only see a short distance ahead, but we can see plenty there that needs to be done.", author: "Alan Turing", year: "1950" },
  { text: "Sometimes it is the people no one can imagine anything of who do the things no one can imagine.", author: "Alan Turing", year: "1945" },
  { text: "A computer would deserve to be called intelligent if it could deceive a human into believing that it was human.", author: "Alan Turing", year: "1950" },
  { text: "If a machine is expected to be infallible, it cannot also be intelligent.", author: "Alan Turing", year: "1947" },
  { text: "Those who can imagine anything, can create the impossible.", author: "Alan Turing", year: "1948" },
  
  // Claude Shannon (Mathematician/Engineer)
  { text: "Information is the resolution of uncertainty.", author: "Claude Shannon", year: "1948" },
  { text: "I just wondered how things were put together.", author: "Claude Shannon", year: "1990" },
  
  // Norbert Wiener (Mathematician/Philosopher)
  { text: "The best material model of a cat is another, or preferably the same, cat.", author: "Norbert Wiener", year: "1950" },
  { text: "We are drowning in information but starved for knowledge.", author: "Norbert Wiener", year: "1950" },
  { text: "Progress imposes not only new possibilities for the future but new restrictions.", author: "Norbert Wiener", year: "1950" },
  { text: "To live effectively is to live with adequate information.", author: "Norbert Wiener", year: "1954" },
  
  // George Pólya (Mathematician)
  { text: "If you can't solve a problem, then there is an easier problem you can solve: find it.", author: "George Pólya", year: "1945" },
  { text: "Mathematics consists of proving the most obvious thing in the least obvious way.", author: "George Pólya", year: "1954" },
  { text: "Geometry is the science of correct reasoning on incorrect figures.", author: "George Pólya", year: "1954" },
  { text: "The first rule of discovery is to have brains and good luck. The second rule of discovery is to sit tight and wait till you get a bright idea.", author: "George Pólya", year: "1945" },
  
  // Andrew Wiles (Mathematician)
  { text: "Perhaps I could best describe my experience of doing mathematics in terms of entering a dark mansion. One goes into the first room, and it's dark, completely dark. One stumbles around bumping into the furniture, and gradually you learn where each piece of furniture is, and finally, after six months or so, you find the light switch.", author: "Andrew Wiles", year: "1994" },
  
  // Paul Erdős (Mathematician)
  { text: "A mathematician is a device for turning coffee into theorems.", author: "Paul Erdős", year: "1960" },
  { text: "Mathematics is not yet ready for such problems.", author: "Paul Erdős", year: "1985" },
  
  // Srinivasa Ramanujan (Mathematician)
  { text: "An equation means nothing to me unless it expresses a thought of God.", author: "Srinivasa Ramanujan", year: "1920" },
  { text: "No equation is complete until it is beautiful.", author: "Srinivasa Ramanujan", year: "1918" },
  
  // Charles Babbage (Computer Pioneer/Mathematician)
  { text: "Errors using inadequate data are much less than those using no data at all.", author: "Charles Babbage", year: "1864" },
  { text: "On two occasions I have been asked, 'If you put into the machine wrong figures, will the right answers come out?' I am not able rightly to apprehend the kind of confusion of ideas that could provoke such a question.", author: "Charles Babbage", year: "1864" },
  { text: "The economy of human time is the next advantage of machinery in manufactures.", author: "Charles Babbage", year: "1832" },
  { text: "At each increase of knowledge, as well as on the contrivance of every new tool, human labour becomes abridged.", author: "Charles Babbage", year: "1832" },
  
  // Ada Lovelace (Mathematician/First Programmer)
  { text: "The Analytical Engine weaves algebraic patterns, just as the Jacquard loom weaves flowers and leaves.", author: "Ada Lovelace", year: "1843" },
  { text: "That brain of mine is something more than merely mortal; as time will show.", author: "Ada Lovelace", year: "1844" },
  { text: "The more I study, the more insatiable do I feel my genius for it to be.", author: "Ada Lovelace", year: "1841" },
  
  // George Boole (Mathematician/Logician)
  { text: "No matter how correct a mathematical theorem may appear to be, one ought never to be satisfied that there was not something imperfect about it until it gives the impression of also being beautiful.", author: "George Boole", year: "1854" },
  
  // William Thomson (Lord Kelvin) (Physicist/Engineer)
  { text: "When you can measure what you are speaking about, and express it in numbers, you know something about it.", author: "Lord Kelvin", year: "1883" },
  { text: "There is nothing new to be discovered in physics now. All that remains is more and more precise measurement.", author: "Lord Kelvin", year: "1900" },
  { text: "Large increases in cost with questionable increases in performance can be tolerated only in race horses and fancy women.", author: "Lord Kelvin", year: "1895" },
  { text: "If you do not rest on the good foundation of nature, you will labour with little honour and less profit.", author: "Lord Kelvin", year: "1889" },
  
  // James Clerk Maxwell (Physicist)
  { text: "The true logic of this world is in the calculus of probabilities.", author: "James Clerk Maxwell", year: "1850" },
  { text: "Thoroughly conscious ignorance is the prelude to every real advance in science.", author: "James Clerk Maxwell", year: "1873" },
  { text: "In every branch of knowledge the progress is proportional to the amount of facts on which to build, and therefore to the facility of obtaining data.", author: "James Clerk Maxwell", year: "1871" },
  { text: "The only laws of matter are those that our minds must fabricate and the only laws of mind are fabricated for it by matter.", author: "James Clerk Maxwell", year: "1873" },
  { text: "All the mathematical sciences are founded on relations between physical laws and laws of numbers.", author: "James Clerk Maxwell", year: "1856" },
  
  // Michael Faraday (Physicist/Chemist)
  { text: "Nothing is too wonderful to be true if it be consistent with the laws of nature.", author: "Michael Faraday", year: "1849" },
  { text: "The five essential entrepreneurial skills for success are concentration, discrimination, organization, innovation and communication.", author: "Michael Faraday", year: "1860" },
  { text: "Work. Finish. Publish.", author: "Michael Faraday", year: "1850" },
  { text: "The lecturer should give the audience full reason to believe that all his powers have been exerted for their pleasure and instruction.", author: "Michael Faraday", year: "1848" },
  
  // Ernest Rutherford (Physicist)
  { text: "All science is either physics or stamp collecting.", author: "Ernest Rutherford", year: "1908" },
  { text: "If your experiment needs statistics, you ought to have done a better experiment.", author: "Ernest Rutherford", year: "1910" },
  { text: "An alleged scientific discovery has no merit unless it can be explained to a barmaid.", author: "Ernest Rutherford", year: "1923" },
  { text: "We haven't got the money, so we've got to think.", author: "Ernest Rutherford", year: "1932" },
  { text: "Never say, 'I tried it once and it did not work.'", author: "Ernest Rutherford", year: "1920" },
  
  // Enrico Fermi (Physicist)
  { text: "Before I came here I was confused about this subject. Having listened to your lecture I am still confused. But on a higher level.", author: "Enrico Fermi", year: "1950" },
  { text: "Whatever Nature has in store for mankind, unpleasant as it may be, men must accept, for ignorance is never better than knowledge.", author: "Enrico Fermi", year: "1954" },
  { text: "There are two possible outcomes: if the result confirms the hypothesis, then you've made a measurement. If the result is contrary to the hypothesis, then you've made a discovery.", author: "Enrico Fermi", year: "1950" },
  
  // Werner Heisenberg (Physicist)
  { text: "Not only is the Universe stranger than we think, it is stranger than we can think.", author: "Werner Heisenberg", year: "1958" },
  { text: "An expert is someone who knows some of the worst mistakes that can be made in his subject, and how to avoid them.", author: "Werner Heisenberg", year: "1969" },
  { text: "The first gulp from the glass of natural sciences will turn you into an atheist, but at the bottom of the glass God is waiting for you.", author: "Werner Heisenberg", year: "1952" },
  { text: "What we observe is not nature itself, but nature exposed to our method of questioning.", author: "Werner Heisenberg", year: "1958" },
  
  // Erwin Schrödinger (Physicist)
  { text: "The task is not to see what has never been seen before, but to think what has never been thought before about what you see everyday.", author: "Erwin Schrödinger", year: "1944" },
  { text: "Quantum physics thus reveals a basic oneness of the universe.", author: "Erwin Schrödinger", year: "1944" },
  { text: "Consciousness cannot be accounted for in physical terms. For consciousness is absolutely fundamental.", author: "Erwin Schrödinger", year: "1944" },
  
  // Max Planck (Physicist)
  { text: "Science cannot solve the ultimate mystery of nature. And that is because, in the last analysis, we ourselves are part of nature and therefore part of the mystery that we are trying to solve.", author: "Max Planck", year: "1932" },
  { text: "An experiment is a question which science poses to Nature, and a measurement is the recording of Nature's answer.", author: "Max Planck", year: "1909" },
  { text: "A new scientific truth does not triumph by convincing its opponents and making them see the light, but rather because its opponents eventually die.", author: "Max Planck", year: "1950" },
  { text: "Anybody who has been seriously engaged in scientific work of any kind realizes that over the entrance to the gates of the temple of science are written the words: 'Ye must have faith.'", author: "Max Planck", year: "1932" },
  
  // Marie Curie (Physicist/Chemist)
  { text: "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.", author: "Marie Curie", year: "1920" },
  { text: "Be less curious about people and more curious about ideas.", author: "Marie Curie", year: "1923" },
  { text: "I was taught that the way of progress was neither swift nor easy.", author: "Marie Curie", year: "1903" },
  { text: "One never notices what has been done; one can only see what remains to be done.", author: "Marie Curie", year: "1894" },
  { text: "Life is not easy for any of us. But what of that? We must have perseverance and above all confidence in ourselves.", author: "Marie Curie", year: "1903" },
  
  // Louis Pasteur (Chemist/Microbiologist)
  { text: "Science knows no country, because knowledge belongs to humanity, and is the torch which illuminates the world.", author: "Louis Pasteur", year: "1876" },
  { text: "Fortune favors the prepared mind.", author: "Louis Pasteur", year: "1854" },
  { text: "In the fields of observation chance favors only the prepared mind.", author: "Louis Pasteur", year: "1854" },
  { text: "Let me tell you the secret that has led me to my goal. My strength lies solely in my tenacity.", author: "Louis Pasteur", year: "1892" },
  { text: "Did you ever observe to whom the accidents happen? Chance favors only the prepared mind.", author: "Louis Pasteur", year: "1854" },
  
  // Dmitri Mendeleev (Chemist)
  { text: "We could live at the present day without a Plato, but a double number of Newtons is required to discover the secrets of nature.", author: "Dmitri Mendeleev", year: "1889" },
  { text: "It is the function of science to discover the existence of a general reign of order in nature and to find the causes governing this order.", author: "Dmitri Mendeleev", year: "1871" },
  { text: "Work, look for peace and calm in work: you will find it nowhere else.", author: "Dmitri Mendeleev", year: "1890" },
  
  // Linus Pauling (Chemist)
  { text: "The way to get good ideas is to get lots of ideas and throw the bad ones away.", author: "Linus Pauling", year: "1964" },
  { text: "Science is the search for truth.", author: "Linus Pauling", year: "1983" },
  { text: "The best way to have a good idea is to have a lot of ideas.", author: "Linus Pauling", year: "1962" },
  { text: "If you want to have good ideas you must have many ideas. Most of them will be wrong, and what you have to learn is which ones to throw away.", author: "Linus Pauling", year: "1964" },
  { text: "Satisfaction of one's curiosity is one of the greatest sources of happiness in life.", author: "Linus Pauling", year: "1992" },
  
  // Robert Oppenheimer (Physicist)
  { text: "The optimist thinks this is the best of all possible worlds. The pessimist fears it is true.", author: "Robert Oppenheimer", year: "1960" },
  { text: "There must be no barriers to freedom of inquiry. There is no place for dogma in science.", author: "Robert Oppenheimer", year: "1949" },
  { text: "The atomic bomb made the prospect of future war unendurable. It has led us up those last few steps to the mountain pass; and beyond there is a different country.", author: "Robert Oppenheimer", year: "1946" },
  { text: "Both the man of science and the man of action live always at the edge of mystery, surrounded by it.", author: "Robert Oppenheimer", year: "1954" },
  
  // Robert Hooke (Natural Philosopher/Polymath)
  { text: "The truth is, the science of Nature has been already too long made only a work of the brain and the fancy. It is now high time that it should return to the plainness and soundness of observations on material and obvious things.", author: "Robert Hooke", year: "1665" },
  { text: "By the help of microscopes, there is nothing so small as to escape our inquiry; hence there is a new visible world discovered to the understanding.", author: "Robert Hooke", year: "1665" },
  
  // Antoine Lavoisier (Chemist)
  { text: "Nothing is lost, nothing is created, everything is transformed.", author: "Antoine Lavoisier", year: "1789" },
  { text: "We must trust to nothing but facts: these are presented to us by Nature, and cannot deceive.", author: "Antoine Lavoisier", year: "1789" },
  
  // Humphry Davy (Chemist)
  { text: "Nothing is so fatal to the progress of the human mind as to suppose that our views of science are ultimate.", author: "Humphry Davy", year: "1812" },
  { text: "The most important of my discoveries have been suggested to me by my failures.", author: "Humphry Davy", year: "1820" },
  { text: "Life is made up, not of great sacrifices or duties, but of little things, in which smiles and kindness, and small obligations given habitually, are what preserve the heart.", author: "Humphry Davy", year: "1825" },
  
  // Joseph Priestley (Chemist/Theologian)
  { text: "The more elaborate our means of communication, the less we communicate.", author: "Joseph Priestley", year: "1790" },
  { text: "Could we have entered into the mind of Sir Isaac Newton, and have traced all the steps by which he produced his great works, we might see nothing very extraordinary in the process.", author: "Joseph Priestley", year: "1777" },
  
  // Entrepreneurial Wisdom - Andrew Carnegie (Industrialist/Steel Magnate)
  { text: "People who are unable to motivate themselves must be content with mediocrity, no matter how impressive their other talents.", author: "Andrew Carnegie", year: "1902" },
  { text: "As I grow older, I pay less attention to what men say. I just watch what they do.", author: "Andrew Carnegie", year: "1905" },
  { text: "The man who acquires the ability to take full possession of his own mind may take possession of anything else to which he is justly entitled.", author: "Andrew Carnegie", year: "1902" },
  { text: "Do your duty and a little more and the future will take care of itself.", author: "Andrew Carnegie", year: "1900" },
  { text: "Concentration is my motto - first honesty, then industry, then concentration.", author: "Andrew Carnegie", year: "1902" },
  { text: "There is no use whatever trying to help people who do not help themselves.", author: "Andrew Carnegie", year: "1889" },
  { text: "The first man gets the oyster, the second man gets the shell.", author: "Andrew Carnegie", year: "1900" },
  { text: "Aim for the highest.", author: "Andrew Carnegie", year: "1902" },
  { text: "No man becomes rich unless he enriches others.", author: "Andrew Carnegie", year: "1902" },
  { text: "You cannot push anyone up the ladder unless he is willing to climb.", author: "Andrew Carnegie", year: "1900" },
  { text: "Think of yourself as on the threshold of unparalleled success. A whole clear, glorious life lies before you. Achieve! Achieve!", author: "Andrew Carnegie", year: "1902" },
  { text: "The way to become rich is to put all your eggs in one basket and then watch that basket.", author: "Andrew Carnegie", year: "1902" },
  
  // John D. Rockefeller (Oil Magnate/Industrialist)
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", year: "1920" },
  { text: "I always tried to turn every disaster into an opportunity.", author: "John D. Rockefeller", year: "1925" },
  { text: "If you want to succeed you should strike out on new paths, rather than travel the worn paths of accepted success.", author: "John D. Rockefeller", year: "1920" },
  { text: "The way to make money is to buy when blood is running in the streets.", author: "John D. Rockefeller", year: "1910" },
  { text: "Singleness of purpose is one of the chief essentials for success in life, no matter what may be one's aim.", author: "John D. Rockefeller", year: "1920" },
  { text: "Good management consists in showing average people how to do the work of superior people.", author: "John D. Rockefeller", year: "1915" },
  { text: "I would rather earn 1% off a 100 people's efforts than 100% of my own efforts.", author: "John D. Rockefeller", year: "1920" },
  { text: "The ability to deal with people is as purchasable a commodity as sugar or coffee, and I will pay more for that ability than for any other under the sun.", author: "John D. Rockefeller", year: "1915" },
  { text: "The secret to success is to do the common things uncommonly well.", author: "John D. Rockefeller", year: "1920" },
  { text: "I believe in the dignity of labor, whether with head or hand; that the world owes no man a living but that it owes every man an opportunity to make a living.", author: "John D. Rockefeller", year: "1920" },
  { text: "Don't blame the marketing department. The buck stops with the chief executive.", author: "John D. Rockefeller", year: "1915" },
  { text: "A friendship founded on business is a good deal better than a business founded on friendship.", author: "John D. Rockefeller", year: "1915" },
  
  // J.P. Morgan (Banker/Financier)
  { text: "Go as far as you can see; when you get there, you'll be able to see further.", author: "J.P. Morgan", year: "1910" },
  { text: "The first step towards getting somewhere is to decide you're not going to stay where you are.", author: "J.P. Morgan", year: "1910" },
  { text: "A man always has two reasons for doing anything: a good reason and the real reason.", author: "J.P. Morgan", year: "1905" },
  { text: "No problem can be solved until it is reduced to some simple form.", author: "J.P. Morgan", year: "1910" },
  { text: "Gold is money. Everything else is credit.", author: "J.P. Morgan", year: "1912" },
  
  // Sam Walton (Walmart Founder)
  { text: "High expectations are the key to everything.", author: "Sam Walton", year: "1990" },
  { text: "There is only one boss. The customer.", author: "Sam Walton", year: "1985" },
  { text: "Outstanding leaders go out of their way to boost the self-esteem of their personnel.", author: "Sam Walton", year: "1990" },
  { text: "Celebrate your successes. Find some humor in your failures.", author: "Sam Walton", year: "1990" },
  { text: "The goal as a company is to have customer service that is not just the best but legendary.", author: "Sam Walton", year: "1988" },
  { text: "Capital isn't scarce; vision is.", author: "Sam Walton", year: "1990" },
  { text: "If you love your work, you'll be out there every day trying to do it the best you possibly can.", author: "Sam Walton", year: "1985" },
  { text: "Appreciate everything your associates do for the business.", author: "Sam Walton", year: "1990" },
  { text: "Each Walmart store should reflect the values of its customers and support the vision they hold for their community.", author: "Sam Walton", year: "1988" },
  { text: "I had to pick myself up and get on with it, do it all over again, only even better this time.", author: "Sam Walton", year: "1992" },
  
  // Ray Kroc (McDonald's)
  { text: "The quality of a leader is reflected in the standards they set for themselves.", author: "Ray Kroc", year: "1975" },
  { text: "Luck is a dividend of sweat. The more you sweat, the luckier you get.", author: "Ray Kroc", year: "1977" },
  { text: "If you work just for money, you'll never make it, but if you love what you're doing and you always put the customer first, success will be yours.", author: "Ray Kroc", year: "1977" },
  { text: "The two most important requirements for major success are: first, being in the right place at the right time, and second, doing something about it.", author: "Ray Kroc", year: "1977" },
  { text: "You're only as good as the people you hire.", author: "Ray Kroc", year: "1975" },
  { text: "If any of my competitors were drowning, I'd stick a hose in their mouth.", author: "Ray Kroc", year: "1977" },
  { text: "I believe in God, family, and McDonald's. And in the office, that order is reversed.", author: "Ray Kroc", year: "1975" },
  { text: "Are you green and growing or ripe and rotting?", author: "Ray Kroc", year: "1977" },
  { text: "None of us is as good as all of us.", author: "Ray Kroc", year: "1975" },
  { text: "I was an overnight success all right, but 30 years is a long, long night.", author: "Ray Kroc", year: "1977" },
  
  // Walt Disney (Entertainment Mogul)
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", year: "1960" },
  { text: "All our dreams can come true, if we have the courage to pursue them.", author: "Walt Disney", year: "1955" },
  { text: "It's kind of fun to do the impossible.", author: "Walt Disney", year: "1958" },
  { text: "When you believe in a thing, believe in it all the way, implicitly and unquestionable.", author: "Walt Disney", year: "1960" },
  { text: "The difference between winning and losing is most often not quitting.", author: "Walt Disney", year: "1963" },
  { text: "You can design and create, and build the most wonderful place in the world. But it takes people to make the dream a reality.", author: "Walt Disney", year: "1955" },
  { text: "The more you like yourself, the less you are like anyone else, which makes you unique.", author: "Walt Disney", year: "1950" },
  { text: "If you can dream it, you can do it.", author: "Walt Disney", year: "1965" },
  { text: "You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you.", author: "Walt Disney", year: "1940" },
  { text: "First, think. Second, believe. Third, dream. And finally, dare.", author: "Walt Disney", year: "1960" },
  { text: "I only hope that we don't lose sight of one thing - that it was all started by a mouse.", author: "Walt Disney", year: "1954" },
  { text: "A man should never neglect his family for business.", author: "Walt Disney", year: "1950" },
  { text: "Times and conditions change so rapidly that we must keep our aim constantly focused on the future.", author: "Walt Disney", year: "1960" },
  
  // Soichiro Honda (Honda Motor Company)
  { text: "Success is 99 percent failure.", author: "Soichiro Honda", year: "1970" },
  { text: "Many people dream of success. To me, success can only be achieved through repeated failure and introspection.", author: "Soichiro Honda", year: "1975" },
  { text: "Enjoy the path you've chosen, whatever it is.", author: "Soichiro Honda", year: "1970" },
  { text: "There is a Japanese proverb that literally goes 'Raise the sail with your stronger hand', meaning you must go after the opportunities that arise in life that you are best equipped to do.", author: "Soichiro Honda", year: "1970" },
  { text: "Action without philosophy is a lethal weapon; philosophy without action is worthless.", author: "Soichiro Honda", year: "1975" },
  
  // Lee Iacocca (Chrysler CEO)
  { text: "The speed of the boss is the speed of the team.", author: "Lee Iacocca", year: "1984" },
  { text: "You can have brilliant ideas, but if you can't get them across, your ideas won't get you anywhere.", author: "Lee Iacocca", year: "1984" },
  { text: "The only rock I know that stays steady, the only institution I know that works, is the family.", author: "Lee Iacocca", year: "1984" },
  { text: "In times of great stress or adversity, it's always best to keep busy, to plow your anger and your energy into something positive.", author: "Lee Iacocca", year: "1984" },
  { text: "Apply yourself. Get all the education you can, but then, by God, do something. Don't just stand there, make it happen.", author: "Lee Iacocca", year: "1984" },
  { text: "We are continually faced by great opportunities brilliantly disguised as insoluble problems.", author: "Lee Iacocca", year: "1984" },
  { text: "The discipline of writing something down is the first step toward making it happen.", author: "Lee Iacocca", year: "1984" },
  { text: "Start with good people, lay out the rules, communicate with your employees, motivate them and reward them. If you do all those things effectively, you can't miss.", author: "Lee Iacocca", year: "1984" },
  { text: "The affection of your employees is the greatest treasure a company can have.", author: "Lee Iacocca", year: "1984" },
  
  // Mary Kay Ash (Mary Kay Cosmetics)
  { text: "Pretend that every single person you meet has a sign around his or her neck that says, 'Make me feel important.'", author: "Mary Kay Ash", year: "1980" },
  { text: "For every failure, there's an alternative course of action. You just have to find it.", author: "Mary Kay Ash", year: "1985" },
  { text: "A company is only as good as the people it keeps.", author: "Mary Kay Ash", year: "1980" },
  { text: "Don't limit yourself. Many people limit themselves to what they think they can do.", author: "Mary Kay Ash", year: "1985" },
  { text: "The speed of the leader is the speed of the gang.", author: "Mary Kay Ash", year: "1980" },
  { text: "People are definitely a company's greatest asset.", author: "Mary Kay Ash", year: "1985" },
  { text: "Everyone has an invisible sign hanging from their neck saying, 'Make me feel important.'", author: "Mary Kay Ash", year: "1980" },
  { text: "Aerodynamically, the bumble bee shouldn't be able to fly, but the bumble bee doesn't know it so it goes on flying anyway.", author: "Mary Kay Ash", year: "1985" },
  { text: "We must have a theme, a goal, a purpose in our lives.", author: "Mary Kay Ash", year: "1980" },
  { text: "So many women just don't know how great they really are. They come to us all vogue outside and vague on the inside.", author: "Mary Kay Ash", year: "1980" },
  
  // Estée Lauder (Estée Lauder Companies)
  { text: "I didn't get there by wishing for it or hoping for it, but by working for it.", author: "Estée Lauder", year: "1985" },
  { text: "I have never worked a day in my life without selling. If I believe in something, I sell it, and I sell it hard.", author: "Estée Lauder", year: "1980" },
  { text: "Look for a sweet person. Forget rich.", author: "Estée Lauder", year: "1985" },
  { text: "I am a product of every other black woman before me who has done or said anything worthwhile. Recognizing that I am part of history is what allows me to soar.", author: "Estée Lauder", year: "1990" },
  
  // Dave Thomas (Wendy's Founder)
  { text: "What do you need to start a business? Three simple things: know your product better than anyone, know your customer, and have a burning desire to succeed.", author: "Dave Thomas", year: "1991" },
  { text: "I think the harder you work, the more luck you have.", author: "Dave Thomas", year: "1991" },
  { text: "The world is full of complainers. But the fact is, nothing comes with a guarantee.", author: "Dave Thomas", year: "1994" },
  
  // Colonel Sanders (KFC Founder)
  { text: "I made a resolve then that I was going to amount to something if I could. And no hours, nor amount of labor, nor amount of money would deter me from giving the best that there was in me.", author: "Colonel Sanders", year: "1970" },
  { text: "There's no reason to be the richest man in the cemetery. You can't do any business from there.", author: "Colonel Sanders", year: "1975" },
  { text: "Feed the poor and get rich or feed the rich and get poor.", author: "Colonel Sanders", year: "1970" },
  
  // Conrad Hilton (Hilton Hotels)
  { text: "Success seems to be connected with action. Successful people keep moving.", author: "Conrad Hilton", year: "1957" },
  { text: "Successful people keep moving, even when they are discouraged and have made mistakes.", author: "Conrad Hilton", year: "1960" },
  
  // Harvey Firestone (Firestone Tire)
  { text: "Capital isn't so important in business. Experience isn't so important. You can get both these things. What is important is ideas.", author: "Harvey Firestone", year: "1920" },
  { text: "It is only as we develop others that we permanently succeed.", author: "Harvey Firestone", year: "1925" },
  { text: "The growth and development of people is the highest calling of leadership.", author: "Harvey Firestone", year: "1925" },
  { text: "Thought, not money, is the real business capital.", author: "Harvey Firestone", year: "1920" },
  
  // William Wrigley Jr. (Wrigley Gum)
  { text: "When two men in business always agree, one of them is unnecessary.", author: "William Wrigley Jr.", year: "1920" },
  { text: "Business is built by wise and courageous men.", author: "William Wrigley Jr.", year: "1925" },
  { text: "Even when you are on the right track, you'll get run over if you just sit there.", author: "William Wrigley Jr.", year: "1920" },
  
  // W. Clement Stone (Insurance Magnate)
  { text: "Thinking will not overcome fear but action will.", author: "W. Clement Stone", year: "1960" },
  { text: "Sales are contingent upon the attitude of the salesman, not the attitude of the prospect.", author: "W. Clement Stone", year: "1962" },
  { text: "There is little difference in people, but that little difference makes a big difference.", author: "W. Clement Stone", year: "1960" },
  { text: "You are a product of your environment. So choose the environment that will best develop you toward your objective.", author: "W. Clement Stone", year: "1962" },
  { text: "Definiteness of purpose is the starting point of all achievement.", author: "W. Clement Stone", year: "1960" },
  { text: "Have the courage to say no. Have the courage to face the truth. Do the right thing because it is right.", author: "W. Clement Stone", year: "1962" },
  { text: "When you discover your mission, you will feel its demand. It will fill you with enthusiasm and a burning desire to get to work on it.", author: "W. Clement Stone", year: "1960" },
  { text: "If you are not making the progress that you would like to make and are capable of making, it is simply because your goals are not clearly defined.", author: "W. Clement Stone", year: "1962" },
  
  // J. Willard Marriott (Marriott Hotels)
  { text: "Good timber does not grow with ease; the stronger the wind, the stronger the trees.", author: "J. Willard Marriott", year: "1970" },
  { text: "The biggest reason most people fail is that they try to fix too much at once - they can't see the root cause of their challenge.", author: "J. Willard Marriott", year: "1975" },
  
  // David Ogilvy (Advertising Pioneer)
  { text: "The best ideas come as jokes. Make your thinking as funny as possible.", author: "David Ogilvy", year: "1983" },
  { text: "Don't bunt. Aim out of the ballpark. Aim for the company of immortals.", author: "David Ogilvy", year: "1983" },
  { text: "If it doesn't sell, it isn't creative.", author: "David Ogilvy", year: "1983" },
  { text: "Never stop testing, and your advertising will never stop improving.", author: "David Ogilvy", year: "1983" },
  { text: "The consumer isn't a moron; she is your wife.", author: "David Ogilvy", year: "1983" },
  { text: "I do not regard advertising as entertainment or an art form, but as a medium of information.", author: "David Ogilvy", year: "1983" },
  { text: "The pursuit of excellence is less profitable than the pursuit of bigness, but it can be more satisfying.", author: "David Ogilvy", year: "1983" },
  { text: "Hire people who are better than you are, then leave them to get on with it.", author: "David Ogilvy", year: "1983" },
  { text: "Why should a manufacturer bet his money, perhaps the future of his company, on your instinct?", author: "David Ogilvy", year: "1963" },
  
  // Peter Drucker (Management Consultant)
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker", year: "1973" },
  { text: "Management is doing things right; leadership is doing the right things.", author: "Peter Drucker", year: "1954" },
  { text: "Efficiency is doing things right; effectiveness is doing the right things.", author: "Peter Drucker", year: "1967" },
  { text: "There is nothing so useless as doing efficiently that which should not be done at all.", author: "Peter Drucker", year: "1963" },
  { text: "Results are gained by exploiting opportunities, not by solving problems.", author: "Peter Drucker", year: "1964" },
  { text: "The most important thing in communication is hearing what isn't said.", author: "Peter Drucker", year: "1973" },
  { text: "Quality in a product or service is not what the supplier puts in. It is what the customer gets out and is willing to pay for.", author: "Peter Drucker", year: "1985" },
  { text: "Long-range planning does not deal with the future decisions, but with the future of present decisions.", author: "Peter Drucker", year: "1959" },
  { text: "The entrepreneur always searches for change, responds to it, and exploits it as an opportunity.", author: "Peter Drucker", year: "1985" },
  { text: "Plans are only good intentions unless they immediately degenerate into hard work.", author: "Peter Drucker", year: "1967" },
  { text: "Knowledge has to be improved, challenged, and increased constantly, or it vanishes.", author: "Peter Drucker", year: "1985" },
  { text: "Culture eats strategy for breakfast.", author: "Peter Drucker", year: "1990" },
  { text: "Do what you do best and outsource the rest.", author: "Peter Drucker", year: "1992" },
  { text: "Business has only two functions - marketing and innovation.", author: "Peter Drucker", year: "1954" },
  { text: "Accept the fact that we have to treat almost anybody as a volunteer.", author: "Peter Drucker", year: "1985" },
  
  // Tom Watson Sr. (IBM)
  { text: "Nothing so conclusively proves a man's ability to lead others as what he does from day to day to lead himself.", author: "Thomas Watson Sr.", year: "1948" },
  { text: "You can be discouraged by failure, or you can learn from it. So go ahead and make mistakes, make all you can. Because, remember that's where you'll find success - on the far side of failure.", author: "Thomas Watson Sr.", year: "1950" },
  { text: "I'm no genius. I'm smart in spots—but I stay around those spots.", author: "Thomas Watson Sr.", year: "1940" },
  { text: "Once an organization loses its spirit of pioneering and rests on its early work, its progress stops.", author: "Thomas Watson Sr.", year: "1948" },
  { text: "The toughest thing about success is that you've got to keep on being a success.", author: "Thomas Watson Sr.", year: "1950" },
  { text: "Every time we've moved ahead in IBM, it was because someone was willing to take a chance.", author: "Thomas Watson Sr.", year: "1948" },
  { text: "Don't make friends who are comfortable to be with. Make friends who will force you to lever yourself up.", author: "Thomas Watson Sr.", year: "1940" },
  { text: "Really big people are, above everything else, courteous, considerate and generous.", author: "Thomas Watson Sr.", year: "1948" },
  { text: "Solve it. Solve it quickly, solve it right or wrong. If you solve it wrong, it will come back and slap you in the face, and then you can solve it right.", author: "Thomas Watson Sr.", year: "1948" },
  { text: "Wisdom is the power to put our time and our knowledge to the proper use.", author: "Thomas Watson Sr.", year: "1950" },
  
  // Napoleon Hill (Author/Success Philosophy)
  { text: "Don't wait. The time will never be just right.", author: "Napoleon Hill", year: "1937" },
  { text: "Strength and growth come only through continuous effort and struggle.", author: "Napoleon Hill", year: "1937" },
  { text: "The starting point of all achievement is desire.", author: "Napoleon Hill", year: "1937" },
  { text: "A goal is a dream with a deadline.", author: "Napoleon Hill", year: "1937" },
  { text: "Whatever the mind can conceive and believe, it can achieve.", author: "Napoleon Hill", year: "1937" },
  { text: "Desire is the starting point of all achievement, not a hope, not a wish, but a keen pulsating desire which transcends everything.", author: "Napoleon Hill", year: "1937" },
  { text: "The ladder of success is never crowded at the top.", author: "Napoleon Hill", year: "1937" },
  { text: "Patience, persistence and perspiration make an unbeatable combination for success.", author: "Napoleon Hill", year: "1937" },
  { text: "Effort only fully releases its reward after a person refuses to quit.", author: "Napoleon Hill", year: "1937" },
  { text: "If you cannot do great things, do small things in a great way.", author: "Napoleon Hill", year: "1937" },
  { text: "Every adversity, every failure, every heartache carries with it the seed of an equal or greater benefit.", author: "Napoleon Hill", year: "1937" },
  { text: "Set your mind on a definite goal and observe how quickly the world stands aside to let you pass.", author: "Napoleon Hill", year: "1937" },
  { text: "Big pay and little responsibility are circumstances seldom found together.", author: "Napoleon Hill", year: "1937" },
  { text: "The way of success is the way of continuous pursuit of knowledge.", author: "Napoleon Hill", year: "1937" },
  
  // Dale Carnegie (Self-Improvement Author)
  { text: "Most of the important things in the world have been accomplished by people who have kept on trying when there seemed to be no hope at all.", author: "Dale Carnegie", year: "1936" },
  { text: "Inaction breeds doubt and fear. Action breeds confidence and courage.", author: "Dale Carnegie", year: "1936" },
  { text: "Success is getting what you want. Happiness is wanting what you get.", author: "Dale Carnegie", year: "1936" },
  { text: "People rarely succeed unless they have fun in what they are doing.", author: "Dale Carnegie", year: "1936" },
  { text: "Develop success from failures. Discouragement and failure are two of the surest stepping stones to success.", author: "Dale Carnegie", year: "1936" },
  { text: "The successful man will profit from his mistakes and try again in a different way.", author: "Dale Carnegie", year: "1936" },
  { text: "Take a chance! All life is a chance.", author: "Dale Carnegie", year: "1936" },
  { text: "Tell me what gives a man or woman their greatest pleasure and I'll tell you their philosophy of life.", author: "Dale Carnegie", year: "1936" },
  { text: "You can make more friends in two months by becoming interested in other people than you can in two years by trying to get other people interested in you.", author: "Dale Carnegie", year: "1936" },
  { text: "When dealing with people, remember you are not dealing with creatures of logic, but creatures of emotion.", author: "Dale Carnegie", year: "1936" },
  
  // Zig Ziglar (Motivational Speaker/Author)
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar", year: "1975" },
  { text: "You were born to win, but to be a winner, you must plan to win, prepare to win, and expect to win.", author: "Zig Ziglar", year: "1975" },
  { text: "You can have everything in life you want, if you will just help other people get what they want.", author: "Zig Ziglar", year: "1975" },
  { text: "People often say that motivation doesn't last. Well, neither does bathing - that's why we recommend it daily.", author: "Zig Ziglar", year: "1978" },
  { text: "Your attitude, not your aptitude, will determine your altitude.", author: "Zig Ziglar", year: "1975" },
  { text: "If you aim at nothing, you will hit it every time.", author: "Zig Ziglar", year: "1975" },
  { text: "Expect the best. Prepare for the worst. Capitalize on what comes.", author: "Zig Ziglar", year: "1978" },
  { text: "A goal properly set is halfway reached.", author: "Zig Ziglar", year: "1975" },
  { text: "If you learn from defeat, you haven't really lost.", author: "Zig Ziglar", year: "1978" },
  { text: "Remember that failure is an event, not a person.", author: "Zig Ziglar", year: "1975" },

  // Biblical Quotes (World English Bible - Public Domain)
  // Focused on making, creating, building, wisdom, and craftsmanship

  // Proverbs - Wisdom and Craftsmanship
  { text: "Trust in the Lord with all your heart, and don't lean on your own understanding.", author: "Proverbs 3:5" },
  { text: "In all your ways acknowledge him, and he will make your paths straight.", author: "Proverbs 3:6" },
  { text: "The fear of the Lord is the beginning of wisdom.", author: "Proverbs 9:10" },
  { text: "Where there is no vision, the people perish.", author: "Proverbs 29:18" },
  { text: "The plans of the diligent lead surely to abundance.", author: "Proverbs 21:5" },
  { text: "Commit your works to the Lord, and your plans will be established.", author: "Proverbs 16:3" },
  { text: "Through wisdom a house is built; by understanding it is established.", author: "Proverbs 24:3" },
  { text: "By knowledge the rooms are filled with all rare and beautiful treasure.", author: "Proverbs 24:4" },
  { text: "A wise man has great power, and a knowledgeable man increases strength.", author: "Proverbs 24:5" },
  { text: "The hand of the diligent ones shall rule.", author: "Proverbs 12:24" },
  { text: "The precious substance of a man is diligence.", author: "Proverbs 12:27" },
  { text: "In all hard work there is profit, but the talk of the lips leads only to poverty.", author: "Proverbs 14:23" },
  { text: "Do you see a man skilled in his work? He will serve kings.", author: "Proverbs 22:29" },
  { text: "Wisdom is supreme. Get wisdom. Yes, though it costs all your possessions, get understanding.", author: "Proverbs 4:7" },
  { text: "The way of the sluggard is like a thorn patch, but the path of the upright is a highway.", author: "Proverbs 15:19" },
  { text: "Apply your heart to instruction, and your ears to the words of knowledge.", author: "Proverbs 23:12" },
  { text: "Counsel in the heart of man is like deep water; but a man of understanding will draw it out.", author: "Proverbs 20:5" },
  { text: "The wise man is instructed when the wise man is reproved.", author: "Proverbs 21:11" },
  { text: "A wise man scales the city of the mighty, and brings down the strength of its confidence.", author: "Proverbs 21:22" },
  { text: "For by wise guidance you wage your war; and victory is in many advisors.", author: "Proverbs 24:6" },
  { text: "Get wisdom. Get understanding. Don't forget, and don't deviate from the words of my mouth.", author: "Proverbs 4:5" },
  { text: "Wisdom rests in the heart of one who has understanding.", author: "Proverbs 14:33" },
  { text: "The heart of the discerning gets knowledge. The ear of the wise seeks knowledge.", author: "Proverbs 18:15" },
  { text: "Buy the truth, and don't sell it. Get wisdom, discipline, and understanding.", author: "Proverbs 23:23" },
  { text: "Prepare your work outside, and get your fields ready. Afterwards, build your house.", author: "Proverbs 24:27" },
  { text: "If you faint in the day of adversity, your strength is small.", author: "Proverbs 24:10" },
  { text: "A man's gift makes room for him, and brings him before great men.", author: "Proverbs 18:16" },
  { text: "Many plans are in a man's heart, but the Lord's counsel will prevail.", author: "Proverbs 19:21" },
  { text: "Plans fail for lack of counsel, but with many advisers they succeed.", author: "Proverbs 15:22" },
  { text: "It is the glory of God to conceal a thing, but the glory of kings is to search out a matter.", author: "Proverbs 25:2" },
  { text: "Like apples of gold in settings of silver, is a word spoken in right circumstances.", author: "Proverbs 25:11" },
  { text: "Where no wood is, the fire goes out. Without gossip, a quarrel dies down.", author: "Proverbs 26:20" },
  { text: "Iron sharpens iron; so a man sharpens his friend's countenance.", author: "Proverbs 27:17" },
  { text: "Don't boast about tomorrow; for you don't know what a day may bring.", author: "Proverbs 27:1" },
  { text: "Be diligent to know the state of your flocks, and pay attention to your herds.", author: "Proverbs 27:23" },
  { text: "The wicked flee when no one pursues; but the righteous are as bold as a lion.", author: "Proverbs 28:1" },
  { text: "A faithful man is rich with blessings.", author: "Proverbs 28:20" },
  { text: "He who works his land will have an abundance of food.", author: "Proverbs 28:19" },
  { text: "He who gives to the poor has no lack.", author: "Proverbs 28:27" },
  { text: "When the righteous triumph, there is great glory.", author: "Proverbs 28:12" },
  { text: "Where there is no revelation, the people cast off restraint.", author: "Proverbs 29:18" },
  { text: "A man's pride brings him low, but one of lowly spirit gains honor.", author: "Proverbs 29:23" },
  { text: "There is no wisdom nor understanding nor counsel against the Lord.", author: "Proverbs 21:30" },
  { text: "The horse is prepared for the day of battle; but victory is with the Lord.", author: "Proverbs 21:31" },
  { text: "A good name is more desirable than great riches, and loving favor is better than silver and gold.", author: "Proverbs 22:1" },
  { text: "The rich rule over the poor. The borrower is servant to the lender.", author: "Proverbs 22:7" },
  { text: "One who sows wickedness reaps trouble, and the rod of his fury will be destroyed.", author: "Proverbs 22:8" },
  { text: "He who has a generous eye will be blessed, for he shares his food with the poor.", author: "Proverbs 22:9" },
  { text: "Train up a child in the way he should go, and when he is old he will not depart from it.", author: "Proverbs 22:6" },

  // Ecclesiastes - Purpose and Labor
  { text: "Whatever your hand finds to do, do it with your might.", author: "Ecclesiastes 9:10" },
  { text: "Two are better than one, because they have a good reward for their labor.", author: "Ecclesiastes 4:9" },
  { text: "If one prevails against him, two shall withstand him; and a threefold cord is not quickly broken.", author: "Ecclesiastes 4:12" },
  { text: "Better is a handful, with quietness, than two handfuls with labor and chasing after wind.", author: "Ecclesiastes 4:6" },
  { text: "Sweet is the sleep of a laboring man.", author: "Ecclesiastes 5:12" },
  { text: "Wisdom is good with an inheritance. Yes, it is a profit to those who see the sun.", author: "Ecclesiastes 7:11" },
  { text: "Wisdom gives strength to the wise man more than ten rulers who are in a city.", author: "Ecclesiastes 7:19" },
  { text: "I know that there is nothing better for them than to rejoice, and to do good as long as they live.", author: "Ecclesiastes 3:12" },
  { text: "There is nothing better for a man than that he should eat and drink, and make his soul enjoy good in his labor.", author: "Ecclesiastes 2:24" },
  { text: "To everything there is a season, and a time to every purpose under heaven.", author: "Ecclesiastes 3:1" },
  { text: "A time to be born, and a time to die; a time to plant, and a time to pluck up that which is planted.", author: "Ecclesiastes 3:2" },
  { text: "A time to break down, and a time to build up.", author: "Ecclesiastes 3:3" },
  { text: "A time to cast away stones, and a time to gather stones together.", author: "Ecclesiastes 3:5" },
  { text: "A time to keep silence, and a time to speak.", author: "Ecclesiastes 3:7" },
  { text: "He has made everything beautiful in its time.", author: "Ecclesiastes 3:11" },
  { text: "I perceived that there is nothing better, than that a man should rejoice in his works.", author: "Ecclesiastes 3:22" },
  { text: "Better is a poor and wise youth than an old and foolish king who doesn't know how to receive admonition any more.", author: "Ecclesiastes 4:13" },
  { text: "When you vow a vow to God, don't defer to pay it; for he has no pleasure in fools. Pay that which you vow.", author: "Ecclesiastes 5:4" },
  { text: "Better is that which your eyes see, than the wandering of the desire.", author: "Ecclesiastes 6:9" },
  { text: "A good name is better than fine perfume; and the day of death better than the day of one's birth.", author: "Ecclesiastes 7:1" },
  { text: "It is better to go to the house of mourning than to go to the house of feasting.", author: "Ecclesiastes 7:2" },
  { text: "Sorrow is better than laughter; for by the sadness of the face the heart is made good.", author: "Ecclesiastes 7:3" },
  { text: "The end of a matter is better than its beginning.", author: "Ecclesiastes 7:8" },
  { text: "Patience is better than pride.", author: "Ecclesiastes 7:8" },
  { text: "Don't be hasty in your spirit to be angry, for anger rests in the bosom of fools.", author: "Ecclesiastes 7:9" },
  { text: "Wisdom is as good as an inheritance. Yes, it is more excellent for those who see the sun.", author: "Ecclesiastes 7:11" },
  { text: "Consider the work of God, for who can make that straight which he has made crooked?", author: "Ecclesiastes 7:13" },
  { text: "In the day of prosperity be joyful, and in the day of adversity consider.", author: "Ecclesiastes 7:14" },
  { text: "Don't be overly wicked, neither be foolish. Why should you die before your time?", author: "Ecclesiastes 7:17" },
  { text: "It is good that you should take hold of this. Yes, also don't withdraw your hand from that.", author: "Ecclesiastes 7:18" },
  { text: "Who is like the wise man? And who knows the interpretation of a thing?", author: "Ecclesiastes 8:1" },
  { text: "A man's wisdom makes his face shine, and the hardness of his face is changed.", author: "Ecclesiastes 8:1" },
  { text: "Though a sinner does evil a hundred times, and lives long, yet surely I know that it will be better with those who fear God.", author: "Ecclesiastes 8:12" },
  { text: "Go your way—eat your bread with joy, and drink your wine with a merry heart; for God has already accepted your works.", author: "Ecclesiastes 9:7" },
  { text: "Live joyfully with the wife whom you love all the days of your life.", author: "Ecclesiastes 9:9" },
  { text: "The race is not to the swift, nor the battle to the strong, neither yet bread to the wise, nor yet riches to men of understanding.", author: "Ecclesiastes 9:11" },
  { text: "A living dog is better than a dead lion.", author: "Ecclesiastes 9:4" },
  { text: "Wisdom is better than weapons of war; but one sinner destroys much good.", author: "Ecclesiastes 9:18" },
  { text: "Dead flies cause the oil of the perfumer to produce an evil odor; so does a little folly outweigh wisdom and honor.", author: "Ecclesiastes 10:1" },
  { text: "If the ax is blunt, and one doesn't sharpen the edge, then he must use more strength; but skill brings success.", author: "Ecclesiastes 10:10" },
  { text: "The words of a wise man's mouth are gracious; but a fool is swallowed by his own lips.", author: "Ecclesiastes 10:12" },
  { text: "A fool also multiplies words.", author: "Ecclesiastes 10:14" },
  { text: "The labor of fools wearies every one of them; for he doesn't know how to go to the city.", author: "Ecclesiastes 10:15" },
  { text: "Cast your bread on the waters; for you shall find it after many days.", author: "Ecclesiastes 11:1" },
  { text: "Give a portion to seven, yes, even to eight; for you don't know what evil will be on the earth.", author: "Ecclesiastes 11:2" },
  { text: "He who observes the wind won't sow; and he who regards the clouds won't reap.", author: "Ecclesiastes 11:4" },
  { text: "In the morning sow your seed, and in the evening don't withhold your hand.", author: "Ecclesiastes 11:6" },
  { text: "For you don't know which will prosper, whether this or that, or whether they both will be equally good.", author: "Ecclesiastes 11:6" },
  { text: "Truly the light is sweet, and it is a pleasant thing for the eyes to see the sun.", author: "Ecclesiastes 11:7" },
  { text: "Rejoice, young man, in your youth, and let your heart cheer you in the days of your youth.", author: "Ecclesiastes 11:9" },
  { text: "Remember also your Creator in the days of your youth, before the evil days come.", author: "Ecclesiastes 12:1" },
  { text: "Of making many books there is no end; and much study is a weariness of the flesh.", author: "Ecclesiastes 12:12" },
  { text: "This is the end of the matter. All has been heard. Fear God and keep his commandments; for this is the whole duty of man.", author: "Ecclesiastes 12:13" },

  // Psalms - Trust and Strength
  { text: "Delight yourself also in the Lord, and he will give you the desires of your heart.", author: "Psalm 37:4" },
  { text: "Commit your way to the Lord. Trust also in him, and he will do this.", author: "Psalm 37:5" },
  { text: "The Lord is my light and my salvation. Whom shall I fear?", author: "Psalm 27:1" },
  { text: "Wait for the Lord. Be strong, and let your heart take courage.", author: "Psalm 27:14" },
  { text: "The Lord is my strength and my shield. My heart has trusted in him, and I am helped.", author: "Psalm 28:7" },
  { text: "I will instruct you and teach you in the way which you shall go. I will counsel you with my eye on you.", author: "Psalm 32:8" },
  { text: "By the word of the Lord the heavens were made; all their host by the breath of his mouth.", author: "Psalm 33:6" },
  { text: "For he spoke, and it was done. He commanded, and it stood firm.", author: "Psalm 33:9" },
  { text: "Blessed is the nation whose God is the Lord, the people whom he has chosen for his own inheritance.", author: "Psalm 33:12" },
  { text: "Our soul has waited for the Lord. He is our help and our shield.", author: "Psalm 33:20" },
  { text: "I sought the Lord, and he answered me, and delivered me from all my fears.", author: "Psalm 34:4" },
  { text: "Those who look to him are radiant. Their faces shall never be covered with shame.", author: "Psalm 34:5" },
  { text: "The angel of the Lord encamps around those who fear him, and delivers them.", author: "Psalm 34:7" },
  { text: "Oh taste and see that the Lord is good. Blessed is the man who takes refuge in him.", author: "Psalm 34:8" },
  { text: "Come, you children, listen to me. I will teach you the fear of the Lord.", author: "Psalm 34:11" },
  { text: "Who is someone who desires life, and loves many days, that he may see good?", author: "Psalm 34:12" },
  { text: "Keep your tongue from evil, and your lips from speaking lies.", author: "Psalm 34:13" },
  { text: "Depart from evil, and do good. Seek peace, and pursue it.", author: "Psalm 34:14" },
  { text: "The Lord is near to those who have a broken heart, and saves those who have a crushed spirit.", author: "Psalm 34:18" },
  { text: "Many are the afflictions of the righteous, but the Lord delivers him out of them all.", author: "Psalm 34:19" },
  { text: "Be still, and know that I am God.", author: "Psalm 46:10" },
  { text: "God is our refuge and strength, a very present help in trouble.", author: "Psalm 46:1" },
  { text: "Cast your burden on the Lord, and he will sustain you.", author: "Psalm 55:22" },
  { text: "In God I have put my trust. I will not be afraid.", author: "Psalm 56:11" },
  { text: "My soul, wait in silence for God alone, for my expectation is from him.", author: "Psalm 62:5" },
  { text: "He only is my rock and my salvation, my fortress. I will not be shaken.", author: "Psalm 62:6" },
  { text: "With God is my salvation and my glory. The rock of my strength, and my refuge, is in God.", author: "Psalm 62:7" },
  { text: "Trust in him at all times, you people. Pour out your heart before him. God is a refuge for us.", author: "Psalm 62:8" },
  { text: "Surely men of low degree are just a breath, and men of high degree are a lie.", author: "Psalm 62:9" },
  { text: "If riches increase, don't set your heart on them.", author: "Psalm 62:10" },
  { text: "God has spoken once; twice I have heard this, that power belongs to God.", author: "Psalm 62:11" },
  { text: "Because your loving kindness is better than life, my lips shall praise you.", author: "Psalm 63:3" },
  { text: "So I will bless you while I live. I will lift up my hands in your name.", author: "Psalm 63:4" },
  { text: "My soul shall be satisfied as with the richest food. My mouth shall praise you with joyful lips.", author: "Psalm 63:5" },
  { text: "Blessed be the Lord, who daily bears our burdens, even the God who is our salvation.", author: "Psalm 68:19" },
  { text: "But I am poor and needy. Come to me quickly, God. You are my help and my deliverer.", author: "Psalm 70:5" },
  { text: "For you are my hope, Lord God; you are my trust from my youth.", author: "Psalm 71:5" },
  { text: "My mouth will tell about your righteousness, and of your salvation all day.", author: "Psalm 71:15" },
  { text: "You, who have shown us many and bitter troubles, you will let me live. You will bring us up again from the depths of the earth.", author: "Psalm 71:20" },
  { text: "How good is God to Israel, to those who are pure in heart!", author: "Psalm 73:1" },
  { text: "Whom do I have in heaven? There is no one on earth whom I desire besides you.", author: "Psalm 73:25" },
  { text: "My flesh and my heart fails, but God is the strength of my heart and my portion forever.", author: "Psalm 73:26" },
  { text: "But it is good for me to come close to God. I have made the Lord God my refuge.", author: "Psalm 73:28" },
  { text: "This is the day that the Lord has made. We will rejoice and be glad in it!", author: "Psalm 118:24" },
  { text: "The stone which the builders rejected has become the cornerstone.", author: "Psalm 118:22" },
  { text: "Your word is a lamp to my feet, and a light for my path.", author: "Psalm 119:105" },
  { text: "The entrance of your words gives light. It gives understanding to the simple.", author: "Psalm 119:130" },
  { text: "Great peace have those who love your law. Nothing causes them to stumble.", author: "Psalm 119:165" },
  { text: "Unless the Lord builds the house, they who build it labor in vain.", author: "Psalm 127:1" },
  { text: "Unless the Lord watches over the city, the watchman guards it in vain.", author: "Psalm 127:1" },
  { text: "It is vain for you to rise up early, to stay up late, eating the bread of toil; for he gives sleep to his loved ones.", author: "Psalm 127:2" },
  { text: "Blessed is everyone who fears the Lord, who walks in his ways.", author: "Psalm 128:1" },
  { text: "For you will eat the labor of your hands. You will be happy, and it will be well with you.", author: "Psalm 128:2" },
  { text: "I will lift up my eyes to the hills. Where does my help come from?", author: "Psalm 121:1" },
  { text: "My help comes from the Lord, who made heaven and earth.", author: "Psalm 121:2" },
  { text: "He will not allow your foot to be moved. He who keeps you will not slumber.", author: "Psalm 121:3" },
  { text: "The Lord is your keeper. The Lord is your shade on your right hand.", author: "Psalm 121:5" },
  { text: "The Lord will keep you from all evil. He will keep your soul.", author: "Psalm 121:7" },
  { text: "The Lord will keep your going out and your coming in, from this time forward, and forever more.", author: "Psalm 121:8" },

  // New Testament - Gospel Quotes
  { text: "Ask, and it will be given you. Seek, and you will find. Knock, and it will be opened for you.", author: "Matthew 7:7" },
  { text: "For everyone who asks receives. He who seeks finds. To him who knocks it will be opened.", author: "Matthew 7:8" },
  { text: "All things, whatever you ask in prayer, believing, you will receive.", author: "Matthew 21:22" },
  { text: "With God all things are possible.", author: "Matthew 19:26" },
  { text: "If you have faith as a grain of mustard seed, you will tell this mountain, 'Move from here to there,' and it will move.", author: "Matthew 17:20" },
  { text: "Nothing will be impossible for you.", author: "Matthew 17:20" },
  { text: "Let your light shine before men, that they may see your good works.", author: "Matthew 5:16" },
  { text: "You are the light of the world. A city located on a hill can't be hidden.", author: "Matthew 5:14" },
  { text: "Neither do you light a lamp and put it under a measuring basket, but on a stand; and it shines to all who are in the house.", author: "Matthew 5:15" },
  { text: "Don't lay up treasures for yourselves on the earth, where moth and rust consume.", author: "Matthew 6:19" },
  { text: "But lay up for yourselves treasures in heaven, where neither moth nor rust consume.", author: "Matthew 6:20" },
  { text: "For where your treasure is, there your heart will be also.", author: "Matthew 6:21" },
  { text: "No one can serve two masters, for either he will hate the one and love the other, or else he will be devoted to one and despise the other.", author: "Matthew 6:24" },
  { text: "Therefore don't be anxious, saying, 'What will we eat?', 'What will we drink?' or, 'With what will we be clothed?'", author: "Matthew 6:31" },
  { text: "But seek first God's Kingdom and his righteousness; and all these things will be given to you as well.", author: "Matthew 6:33" },
  { text: "Therefore don't be anxious for tomorrow, for tomorrow will be anxious for itself.", author: "Matthew 6:34" },
  { text: "Each day's own evil is sufficient.", author: "Matthew 6:34" },
  { text: "Enter in by the narrow gate; for the gate is wide and the way is broad that leads to destruction.", author: "Matthew 7:13" },
  { text: "The gate is narrow and the way is restricted that leads to life, and there are few who find it.", author: "Matthew 7:14" },
  { text: "By their fruits you will know them. Do you gather grapes from thorns, or figs from thistles?", author: "Matthew 7:16" },
  { text: "Even so, every good tree produces good fruit, but the corrupt tree produces evil fruit.", author: "Matthew 7:17" },
  { text: "Therefore everyone who hears these words of mine and does them, I will liken him to a wise man who built his house on a rock.", author: "Matthew 7:24" },
  { text: "The rain came down, the floods came, and the winds blew and beat on that house; and it didn't fall, for it was founded on the rock.", author: "Matthew 7:25" },
  { text: "Everyone who hears these words of mine and doesn't do them will be like a foolish man who built his house on the sand.", author: "Matthew 7:26" },
  { text: "Come to me, all you who labor and are heavily burdened, and I will give you rest.", author: "Matthew 11:28" },
  { text: "Take my yoke upon you and learn from me, for I am gentle and humble in heart; and you will find rest for your souls.", author: "Matthew 11:29" },
  { text: "For my yoke is easy, and my burden is light.", author: "Matthew 11:30" },
  { text: "The Kingdom of Heaven is like a treasure hidden in the field, which a man found and hid.", author: "Matthew 13:44" },
  { text: "In his joy, he goes and sells all that he has and buys that field.", author: "Matthew 13:44" },
  { text: "Again, the Kingdom of Heaven is like a man who is a merchant seeking fine pearls.", author: "Matthew 13:45" },
  { text: "Having found one pearl of great price, he went and sold all that he had and bought it.", author: "Matthew 13:46" },
  { text: "For what will it profit a man if he gains the whole world and forfeits his life?", author: "Matthew 16:26" },
  { text: "If you have faith and don't doubt, you will not only do what was done to the fig tree, but even if you told this mountain, 'Be taken up and cast into the sea,' it would be done.", author: "Matthew 21:21" },
  { text: "All authority has been given to me in heaven and on earth.", author: "Matthew 28:18" },
  { text: "Go and make disciples of all nations.", author: "Matthew 28:19" },
  { text: "Behold, I am with you always, even to the end of the age.", author: "Matthew 28:20" },
  { text: "All things are possible to him who believes.", author: "Mark 9:23" },
  { text: "If you can believe, all things are possible to him who believes.", author: "Mark 9:23" },
  { text: "Whatever you pray and ask for, believe that you have received them, and you shall have them.", author: "Mark 11:24" },
  { text: "The things which are impossible with men are possible with God.", author: "Luke 18:27" },
  { text: "For nothing spoken by God is impossible.", author: "Luke 1:37" },
  { text: "Give, and it will be given to you: good measure, pressed down, shaken together, and running over.", author: "Luke 6:38" },
  { text: "For with the same measure you measure it will be measured back to you.", author: "Luke 6:38" },
  { text: "To whom much is given, of him will much be required.", author: "Luke 12:48" },
  { text: "To whom much was entrusted, of him more will be asked.", author: "Luke 12:48" },
  { text: "Which of you, desiring to build a tower, doesn't first sit down and count the cost?", author: "Luke 14:28" },
  { text: "In the beginning was the Word, and the Word was with God, and the Word was God.", author: "John 1:1" },
  { text: "All things were made through him. Without him, nothing was made that has been made.", author: "John 1:3" },
  { text: "In him was life, and the life was the light of men.", author: "John 1:4" },
  { text: "The light shines in the darkness, and the darkness hasn't overcome it.", author: "John 1:5" },
  { text: "I am the light of the world. He who follows me will not walk in the darkness, but will have the light of life.", author: "John 8:12" },
  { text: "You will know the truth, and the truth will make you free.", author: "John 8:32" },
  { text: "I came that they may have life, and may have it abundantly.", author: "John 10:10" },
  { text: "I am the way, the truth, and the life.", author: "John 14:6" },
  { text: "I am the vine. You are the branches. He who remains in me and I in him bears much fruit.", author: "John 15:5" },
  { text: "Apart from me you can do nothing.", author: "John 15:5" },
  { text: "You didn't choose me, but I chose you and appointed you, that you should go and bear fruit.", author: "John 15:16" },
  { text: "These things I have spoken to you, that my joy may remain in you, and that your joy may be made full.", author: "John 15:11" },
  { text: "I have told you these things, that in me you may have peace. In the world you have trouble; but cheer up! I have overcome the world.", author: "John 16:33" },
  { text: "Peace I leave with you. My peace I give to you; not as the world gives, I give to you.", author: "John 14:27" },
  { text: "Don't let your heart be troubled, neither let it be fearful.", author: "John 14:27" },
  { text: "In my Father's house are many homes. If it weren't so, I would have told you. I am going to prepare a place for you.", author: "John 14:2" },
  { text: "If I go and prepare a place for you, I will come again and will receive you to myself.", author: "John 14:3" },
  { text: "Greater love has no one than this, that someone lay down his life for his friends.", author: "John 15:13" },
  { text: "If you remain in me, and my words remain in you, you will ask whatever you desire, and it will be done for you.", author: "John 15:7" },
  { text: "In this my Father is glorified, that you bear much fruit; and so you will be my disciples.", author: "John 15:8" },
  { text: "Even as the Father has loved me, I also have loved you. Remain in my love.", author: "John 15:9" },
  { text: "Don't be conformed to this world, but be transformed by the renewing of your mind.", author: "Romans 12:2" },
  { text: "We know that all things work together for good for those who love God.", author: "Romans 8:28" },
  { text: "If God is for us, who can be against us?", author: "Romans 8:31" },
  { text: "For I am persuaded that neither death, nor life, nor angels, nor principalities, nor things present, nor things to come can separate us from the love of God.", author: "Romans 8:38-39" },
  { text: "I can do all things through Christ who strengthens me.", author: "Philippians 4:13" },
  { text: "Don't be anxious for anything, but in everything by prayer and pleading with thanksgiving let your requests be made known to God.", author: "Philippians 4:6" },
  { text: "The peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.", author: "Philippians 4:7" },
  { text: "Finally, brothers, whatever things are true, whatever things are honorable, whatever things are just, whatever things are pure, whatever things are lovely, whatever things are of good report: if there is any virtue and if there is anything worthy of praise, think about these things.", author: "Philippians 4:8" },
  { text: "My God will supply every need of yours according to his riches in glory in Christ Jesus.", author: "Philippians 4:19" },
  { text: "Whatever you do, work heartily, as for the Lord and not for men.", author: "Colossians 3:23" },
  { text: "Knowing that from the Lord you will receive the reward of the inheritance; for you serve the Lord Christ.", author: "Colossians 3:24" },
  { text: "Whatever you do, in word or in deed, do all in the name of the Lord Jesus, giving thanks to God the Father through him.", author: "Colossians 3:17" },
  { text: "For God didn't give us a spirit of fear, but of power, love, and self-control.", author: "2 Timothy 1:7" },
  { text: "Let us hold fast the confession of our hope without wavering; for he who promised is faithful.", author: "Hebrews 10:23" },
  { text: "Now faith is assurance of things hoped for, proof of things not seen.", author: "Hebrews 11:1" },
  { text: "Without faith it is impossible to be well pleasing to him, for he who comes to God must believe that he exists.", author: "Hebrews 11:6" },
  { text: "And that he is a rewarder of those who seek him.", author: "Hebrews 11:6" },
  { text: "Let us run with perseverance the race that is set before us, looking to Jesus.", author: "Hebrews 12:1-2" },
  { text: "For whom the Lord loves, he disciplines, and chastises every son whom he receives.", author: "Hebrews 12:6" },
  { text: "If any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach, and it will be given to him.", author: "James 1:5" },
  { text: "But let him ask in faith, without any doubting, for he who doubts is like a wave of the sea, driven by the wind and tossed.", author: "James 1:6" },
  { text: "Be doers of the word, and not only hearers, deluding your own selves.", author: "James 1:22" },
  { text: "For if anyone is a hearer of the word and not a doer, he is like a man looking at his natural face in a mirror.", author: "James 1:23" },
  { text: "But be doers of the word, and not only hearers.", author: "James 1:22" },
  { text: "Faith apart from works is dead.", author: "James 2:26" },
  { text: "Show me your faith without works, and I will show you my faith by my works.", author: "James 2:18" },
  { text: "Humble yourselves in the sight of the Lord, and he will exalt you.", author: "James 4:10" },
  { text: "Come near to God, and he will come near to you.", author: "James 4:8" },
  { text: "Casting all your worries on him, because he cares for you.", author: "1 Peter 5:7" },
  { text: "Be sober and self-controlled. Be watchful. Your adversary, the devil, walks around like a roaring lion, seeking whom he may devour.", author: "1 Peter 5:8" },
  { text: "Resist him steadfast in your faith.", author: "1 Peter 5:9" },
  { text: "But may the God of all grace, who called you to his eternal glory by Christ Jesus, after you have suffered a little while, perfect, establish, strengthen, and settle you.", author: "1 Peter 5:10" },
  { text: "His divine power has granted to us all things that pertain to life and godliness.", author: "2 Peter 1:3" },
  { text: "If we confess our sins, he is faithful and righteous to forgive us the sins and to cleanse us from all unrighteousness.", author: "1 John 1:9" },
  { text: "See how great a love the Father has given to us, that we should be called children of God!", author: "1 John 3:1" },
  { text: "This is the boldness which we have toward him, that if we ask anything according to his will, he listens to us.", author: "1 John 5:14" },
  { text: "And if we know that he listens to us, whatever we ask, we know that we have the petitions which we have asked of him.", author: "1 John 5:15" },
  { text: "For whatever is born of God overcomes the world. This is the victory that has overcome the world: your faith.", author: "1 John 5:4" },
  { text: "Behold, I stand at the door and knock. If anyone hears my voice and opens the door, I will come in to him and will dine with him, and he with me.", author: "Revelation 3:20" },
  { text: "Behold, I make all things new.", author: "Revelation 21:5" },
];

export const getRandomQuote = (): MakerQuote => {
  const randomIndex = Math.floor(Math.random() * makerQuotes.length);
  return makerQuotes[randomIndex];
};
