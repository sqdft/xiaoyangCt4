
import { WritingPrompt } from '../types';

export const PROMPT_BANK: WritingPrompt[] = [
  {
    id: '4-1',
    type: 'Letter',
    typeName: '建议信',
    title: 'A Letter to the Library',
    directions: 'Write a letter to the university library. You should put forward some advice on how to improve its services. (120-180 words)',
    modelEssay: 'Dear Librarian,\n\nI am a sophomore in the English Department, and I am writing to express my sincere appreciation for the library\'s excellent services. However, I would like to offer some suggestions to further improve our study environment.\n\nFirstly, I suggest extending the opening hours during the exam season. Many students struggle to find a quiet place to study late at night. Secondly, the Wi-Fi connection in some areas is unstable, which hinders our efficiency in searching for online resources. \n\nI believe that these improvements will benefit all students. Thank you for your time and consideration.\n\nYours sincerely,\nLi Hua'
  },
  {
    id: '4-2',
    type: 'Essay',
    typeName: '议论文',
    title: 'The Importance of Reading Classics',
    directions: 'Write an essay on the importance of reading classics. (120-180 words)',
    modelEssay: 'In the era of information explosion, an increasing number of people prefer fragmented reading on smartphones. However, I believe that reading classics remains indispensable for college students.\n\nTo begin with, classics are the wisdom of our ancestors, providing us with profound insights into human nature and history. Furthermore, reading masterpieces helps us cultivate critical thinking skills and improve our language proficiency. Unlike modern "fast-food" literature, classics require deep concentration, which is a vital quality in a noisy world.\n\nIn conclusion, we should cherish the opportunity to read classics. By doing so, we can not only enrich our knowledge but also find spiritual peace.'
  },
  {
    id: '4-3',
    type: 'Notice',
    typeName: '通知',
    title: 'Volunteer Recruitment',
    directions: 'Write a notice to recruit volunteers for a museum. (120-180 words)',
    modelEssay: 'NOTICE\n\nJune 10, 2024\n\nTo provide better services for visitors, the City Museum is now looking for 20 student volunteers for the upcoming summer vacation. \n\nThe responsibilities include guiding visitors, explaining the history of exhibits, and maintaining order in the halls. Applicants should have a good command of English and a strong sense of responsibility. Preference will be given to those who have a background in history or art.\n\nInterested students please send your resume to museum_vol@email.com before June 20. Come and join us to experience the charm of history!\n\nThe City Museum'
  },
  {
    id: '4-4',
    type: 'Essay',
    typeName: '社会热点',
    title: 'On Plastic Surgery',
    directions: 'Comment on the phenomenon of more and more college students having plastic surgery. (120-180 words)',
    modelEssay: 'Nowadays, plastic surgery has gained immense popularity among college students. Some believe it can boost confidence and create better career opportunities. However, I hold a more cautious view toward this trend.\n\nOn the one hand, excessive focus on physical appearance may lead to an unhealthy mindset. True beauty comes from within, such as one\'s personality and wisdom. On the other hand, surgery carries potential health risks and financial burdens. Many students are not fully aware of the possible complications.\n\nIn my opinion, college students should focus more on their inner growth and academic performance rather than chasing superficial beauty through surgery.'
  },
  {
    id: '4-5',
    type: 'Letter',
    typeName: '道歉信',
    title: 'An Apology for Late Return',
    directions: 'Write a letter to your friend to apologize for returning his/her book late. (120-180 words)',
    modelEssay: 'Dear Tom,\n\nI am writing to express my deepest apologies for not returning your book, "The Great Gatsby," on time as I promised last week.\n\nI had intended to finish it by Sunday, but I was suddenly caught up in a busy project at school. Moreover, I accidentally left the book in my dorm when I went home for the weekend. I feel extremely sorry for any inconvenience this may have caused you.\n\nI have already finished the book and will bring it to you tomorrow morning. To make up for my lateness, I would like to treat you to coffee at the campus cafe. I hope you can forgive me.\n\nBest regards,\nLi Hua'
  },
  {
    id: '4-6',
    type: 'Essay',
    typeName: '教育公平',
    title: 'Online Education vs. Traditional Education',
    directions: 'Compare online education with traditional classroom education. (120-180 words)',
    modelEssay: 'With the rapid advancement of technology, online education has become a mainstream learning method. Compared to traditional classroom education, it has both advantages and disadvantages.\n\nOnline education offers unparalleled flexibility and convenience. Students can access top-tier resources from anywhere at any time. However, traditional education provides a structured environment and face-to-face interaction, which are crucial for developing social skills and maintaining focus.\n\nIn my view, the ideal approach is a combination of both. We should utilize the convenience of online tools while preserving the irreplaceable benefits of classroom interaction.'
  },
  {
    id: '4-7',
    type: 'Notice',
    typeName: '社团招新',
    title: 'Join the English Club',
    directions: 'Write a notice to invite students to join the English Club. (120-180 words)',
    modelEssay: 'NOTICE\n\nSeptember 5, 2024\n\nDo you want to improve your spoken English and meet new friends? The English Club is now welcoming new members!\n\nWe offer a variety of activities, including weekly English corners, movie nights, and speech contests. Whether you are a beginner or an advanced speaker, there is a place for you. Joining our club will not only boost your confidence but also broaden your cultural horizons.\n\nOur first meeting will be held this Friday at 7:00 p.m. in Room 302 of the Student Center. Don\'t miss out! For more info, scan the QR code on the poster.\n\nThe English Club'
  },
  {
    id: '4-8',
    type: 'Essay',
    typeName: '环境保护',
    title: 'Reducing Food Waste',
    directions: 'Write an essay on the importance of reducing food waste on campus. (120-180 words)',
    modelEssay: 'Food waste is a pressing issue that deserves our immediate attention. On many university campuses, large amounts of food are discarded every day, which is a significant waste of resources.\n\nReducing food waste is important for several reasons. Firstly, it reflects our respect for the labor of farmers. Secondly, it contributes to environmental protection by reducing the burden on landfills. Lastly, as students, we should cultivate the habit of thrift, which is a traditional virtue.\n\nIn conclusion, everyone should play a part in reducing food waste. Let\'s start by ordering only what we can eat and taking leftovers home.'
  },
  {
    id: '4-9',
    type: 'Letter',
    typeName: '感谢信',
    title: 'A Letter of Thanks to a Teacher',
    directions: 'Write a letter to thank your teacher for his/her help in your study. (120-180 words)',
    modelEssay: 'Dear Professor Zhang,\n\nI am writing to express my heartfelt gratitude for your guidance and support during this semester. Your lectures on English literature have been incredibly inspiring and have greatly enriched my knowledge.\n\nI especially want to thank you for the extra time you spent helping me with my research paper. Your insightful suggestions were crucial to the completion of my project. Because of your encouragement, I have gained much more confidence in my academic pursuits.\n\nPlease accept my sincere thanks once again. I wish you all the best in your career and life.\n\nYours respectfully,\nLi Hua'
  },
  {
    id: '4-10',
    type: 'Essay',
    typeName: '心理健康',
    title: 'Coping with Academic Pressure',
    directions: 'Give suggestions on how college students can cope with academic pressure. (120-180 words)',
    modelEssay: 'Nowadays, college students often face intense academic pressure from exams and future career competition. If not managed properly, this stress can negatively impact their mental health.\n\nTo cope with academic pressure, students should first learn to manage their time effectively. A well-organized schedule can reduce anxiety and improve efficiency. Additionally, engaging in physical exercise or hobbies is a great way to release tension. Most importantly, seeking support from friends, family, or counselors can provide comfort and fresh perspectives.\n\nIn summary, pressure is a part of life. By adopting a positive attitude and effective strategies, we can turn pressure into motivation for growth.'
  }
];

export const getRandomPrompt = (): WritingPrompt => {
  return PROMPT_BANK[Math.floor(Math.random() * PROMPT_BANK.length)];
};
