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
  { text: "The sun, with all those planets revolving around it, can still ripen a bunch of grapes as if it had nothing else in the universe to do.", author: "Galileo Galilei" },
  { text: "Nature is pleased with simplicity.", author: "Isaac Newton" },
  { text: "Make everything as simple as possible, but not simpler.", author: "Albert Einstein", year: "1933" },
  { text: "The more you know, the more you realize you don't know.", author: "Aristotle", year: "350 BC" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", year: "350 BC" },
  { text: "There is no substitute for hard work.", author: "Thomas Edison" },
  { text: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.", author: "Thomas Edison" },
  { text: "I find out what the world needs. Then, I go ahead and invent it.", author: "Thomas Edison" },
  { text: "Opportunity is missed by most people because it is dressed in overalls and looks like work.", author: "Thomas Edison" },
  { text: "Hell, there are no rules here - we're trying to accomplish something.", author: "Thomas Edison", year: "1903" },
];

export const getRandomQuote = (): MakerQuote => {
  const randomIndex = Math.floor(Math.random() * makerQuotes.length);
  return makerQuotes[randomIndex];
};
