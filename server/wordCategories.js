/**
 * wordPool.js  (compact, India-focused edition)
 * ~3,000 unique words for Name / Place / Animal / Thing style games.
 *
 * Groups     : name, place, animal, thing, entertainment
 * Categories : 39 (indianNames, bollywoodActors, indianCities, indianFoods, indianMovies, ...)
 *
 * Usage (ES module):
 *   import { WORD_POOL, getRandomWord, getWordsByCategory, searchWords, isValidAnswer } from './wordPool.js';
 *   getRandomWord('bollywoodActors');                 // "Ranveer Singh"
 *   getRandomWord('animal', { singleWord: true });
 *   getRandomWord(null, { minLen: 4, maxLen: 8 });
 */

export const WORD_POOL = {
  name: {
  indianNames: [
    "Aadhya", "Aanya", "Aarav", "Aarti", "Abhinav", "Abhishek", "Aditya", "Advik", "Ajay", "Akash", "Alok",
    "Aman", "Amandeep", "Amit", "Ananya", "Anika", "Anil", "Anita", "Anjali", "Ankit", "Ankur", "Anuj",
    "Arjun", "Arman", "Arun", "Aryan", "Asha", "Ashish", "Ashok", "Atharv", "Ayaan", "Ayesha", "Balwinder",
    "Bharat", "Bhavesh", "Bhavna", "Brijesh", "Chetan", "Chirag", "Chitra", "Danish", "Deepa", "Deepak",
    "Dev", "Devansh", "Dhruv", "Dilip", "Dinesh", "Divya", "Diya", "Faizan", "Fatima", "Ganesh", "Gaurav",
    "Gauri", "Geeta", "Girish", "Gopal", "Gurpreet", "Hari", "Harish", "Harpreet", "Harsh", "Hema", "Hemant",
    "Imran", "Indu", "Ira", "Irfan", "Isha", "Ishaan", "Jai", "Jaspreet", "Jatin", "Jitendra", "Jyoti",
    "Kailash", "Kajal", "Kamal", "Kamla", "Karan", "Kartik", "Kavya", "Kiran", "Komal", "Krishna", "Kriti",
    "Kuldeep", "Kunal", "Lakhvir", "Lakshmi", "Lakshya", "Lalit", "Madhu", "Mahesh", "Mamta", "Manish",
    "Manju", "Manoj", "Manpreet", "Mayank", "Meera", "Megha", "Mohammed", "Mohan", "Mohit", "Mukesh", "Mukul",
    "Myra", "Naman", "Narayan", "Narendra", "Naveen", "Navjot", "Navya", "Neeraj", "Neha", "Nidhi", "Nikhil",
    "Nisha", "Nitin", "Omkar", "Pankaj", "Pari", "Parth", "Pawan", "Piyush", "Pooja", "Poonam", "Pradeep",
    "Prakash", "Pranav", "Prateek", "Preeti", "Priya", "Priyanka", "Radha", "Raghav", "Rahul", "Raj", "Rajat",
    "Rajesh", "Rajiv", "Rakesh", "Ramesh", "Ravi", "Rekha", "Renu", "Reyansh", "Rishabh", "Ritu", "Riya",
    "Rizwan", "Rohan", "Rupali", "Saanvi", "Sachin", "Sagar", "Sahil", "Sai", "Sakshi", "Salman", "Sana",
    "Sandeep", "Sanjay", "Satish", "Saurabh", "Savita", "Seema", "Shanti", "Shaurya", "Shikha", "Shreya",
    "Shubham", "Shyam", "Siddharth", "Simran", "Sita", "Siya", "Sneha", "Sonal", "Subhash", "Sukhdev",
    "Sumit", "Sunil", "Sunita", "Suresh", "Swati", "Tanvi", "Tara", "Tarun", "Tejas", "Tejinder", "Trisha",
    "Tushar", "Uday", "Umesh", "Usha", "Utkarsh", "Vandana", "Varsha", "Varun", "Vedant", "Vidya", "Vihaan",
    "Vijay", "Vikas", "Vikram", "Vimla", "Vinay", "Vinod", "Vipul", "Vishal", "Vivaan", "Yash", "Yogesh",
    "Yuvraj", "Zara", "Zoya",
  ],
  bollywoodActors: [
    "Aamir Khan", "Abhay Deol", "Abhishek Bachchan", "Ajay Devgn", "Akshay Kumar", "Allu Arjun",
    "Amitabh Bachchan", "Amol Palekar", "Amrish Puri", "Anil Kapoor", "Anupam Kher", "Arjun Kapoor",
    "Arshad Warsi", "Ashok Kumar", "Ashutosh Rana", "Ayushmann Khurrana", "Bobby Deol", "Bobby Singh",
    "Boman Irani", "Chiranjeevi", "Dev Anand", "Dhanush", "Dharmendra", "Dilip Kumar", "Dulquer Salmaan",
    "Emraan Hashmi", "Fahadh Faasil", "Fardeen Khan", "Farhan Akhtar", "Govinda", "Gulshan Grover",
    "Hrithik Roshan", "Imran Khan", "Irrfan Khan", "Jackie Shroff", "Jaideep Ahlawat", "Jeetendra",
    "Jimmy Sheirgill", "John Abraham", "Johnny Lever", "Jr NTR", "Kader Khan", "Kamal Haasan",
    "Kartik Aaryan", "Kunal Kemmu", "Mahesh Babu", "Mammootty", "Manoj Bajpayee", "Mithun Chakraborty",
    "Mohanlal", "Nagarjuna", "Naseeruddin Shah", "Nawazuddin Siddiqui", "Om Puri", "Pankaj Tripathi",
    "Paresh Rawal", "Prabhas", "Pran", "Pratik Gandhi", "Raj Kapoor", "Rajesh Khanna", "Rajinikanth",
    "Rajkummar Rao", "Rajpal Yadav", "Ram Charan", "Ranbir Kapoor", "Ranbir Singh", "Randeep Hooda",
    "Ranveer Singh", "Rishi Kapoor", "Riteish Deshmukh", "Ronit Roy", "Saif Ali Khan", "Salman Khan",
    "Sanjay Dutt", "Sanjay Mishra", "Sanjeev Kumar", "Saurabh Shukla", "Shah Rukh Khan", "Shahid Kapoor",
    "Shakti Kapoor", "Shammi Kapoor", "Sharman Joshi", "Shashi Kapoor", "Sidharth Malhotra", "Suniel Shetty",
    "Sunny Deol", "Suriya", "Sushant Singh Rajput", "Tiger Shroff", "Varun Dhawan", "Venkatesh",
    "Vicky Kaushal", "Vijay", "Vijay Deverakonda", "Vijay Raaz", "Vinod Khanna", "Vivek Oberoi", "Yash",
    "Zayed Khan",
  ],
  bollywoodActresses: [
    "Aishwarya Rai", "Alia Bhatt", "Amrita Rao", "Ananya Panday", "Anushka Sharma", "Anushka Shetty",
    "Bhumi Pednekar", "Bipasha Basu", "Deepika Padukone", "Disha Patani", "Divya Dutta", "Fatima Sana Shaikh",
    "Genelia Dsouza", "Hema Malini", "Huma Qureshi", "Jacqueline Fernandez", "Janhvi Kapoor", "Jaya Bachchan",
    "Juhi Chawla", "Kajal Aggarwal", "Kajol", "Kangana Ranaut", "Kareena Kapoor", "Karisma Kapoor",
    "Katrina Kaif", "Keerthy Suresh", "Kiara Advani", "Konkona Sen Sharma", "Kriti Kharbanda", "Kriti Sanon",
    "Lara Dutta", "Madhubala", "Madhuri Dixit", "Malaika Arora", "Meena Kumari", "Mouni Roy", "Nargis",
    "Nayanthara", "Neena Gupta", "Nora Fatehi", "Parineeti Chopra", "Parveen Babi", "Pooja Hegde",
    "Preity Zinta", "Priyanka Chopra", "Radhika Apte", "Rani Mukerji", "Rashmika Mandanna", "Raveena Tandon",
    "Rekha", "Richa Chadha", "Sai Pallavi", "Samantha Ruth Prabhu", "Sanya Malhotra", "Sara Ali Khan",
    "Sharmila Tagore", "Sharvari Wagh", "Shefali Shah", "Shehnaaz Gill", "Shilpa Shetty", "Shraddha Kapoor",
    "Shruti Haasan", "Sobhita Dhulipala", "Sonakshi Sinha", "Sonam Kapoor", "Sridevi", "Sunny Leone",
    "Sushmita Sen", "Swara Bhasker", "Taapsee Pannu", "Tabu", "Tamannaah Bhatia", "Tara Sutaria",
    "Triptii Dimri", "Trisha Krishnan", "Urmila Matondkar", "Vidya Balan", "Waheeda Rehman", "Yami Gautam",
    "Zeenat Aman",
  ],
  southStars: [
    "Ajith Kumar", "Allu Arjun", "Anushka Shetty", "Chiranjeevi", "Darshan", "Dhanush", "Dulquer Salmaan",
    "Fahadh Faasil", "Jr NTR", "Kajal Aggarwal", "Kamal Haasan", "Karthi", "Keerthy Suresh", "Mahesh Babu",
    "Mammootty", "Mohanlal", "Nagarjuna", "Nani", "Nayanthara", "Pooja Hegde", "Prabhas", "Puneeth Rajkumar",
    "Rajinikanth", "Ram Charan", "Rana Daggubati", "Rashmika Mandanna", "Rishab Shetty", "Sai Pallavi",
    "Samantha", "Shruti Haasan", "Sivakarthikeyan", "Sudeep", "Suriya", "Tamannaah", "Trisha", "Upendra",
    "Vijay", "Vijay Deverakonda", "Vikram", "Yash",
  ],
  hollywoodStars: [
    "Al Pacino", "Amy Adams", "Angelina Jolie", "Anna Kendrick", "Anne Hathaway", "Anthony Hopkins",
    "Anya Taylor Joy", "Arnold Schwarzenegger", "Ben Affleck", "Benedict Cumberbatch", "Brad Pitt",
    "Brie Larson", "Bruce Willis", "Cate Blanchett", "Charlize Theron", "Chris Evans", "Chris Hemsworth",
    "Chris Pine", "Chris Pratt", "Christian Bale", "Daniel Craig", "Denzel Washington", "Dwayne Johnson",
    "Elizabeth Olsen", "Emily Blunt", "Emma Stone", "Emma Thompson", "Emma Watson", "Florence Pugh",
    "Gal Gadot", "George Clooney", "Halle Berry", "Harrison Ford", "Hugh Jackman", "Jack Nicholson",
    "Jason Statham", "Jennifer Aniston", "Jennifer Garner", "Jennifer Lawrence", "Jennifer Lopez",
    "Jeremy Renner", "Joaquin Phoenix", "Johnny Depp", "Julia Roberts", "Kate Winslet", "Keanu Reeves",
    "Keira Knightley", "Leonardo DiCaprio", "Lupita Nyongo", "Margot Robbie", "Mark Hamill", "Mark Ruffalo",
    "Matt Damon", "Megan Fox", "Meryl Streep", "Mila Kunis", "Morgan Freeman", "Natalie Portman",
    "Nicole Kidman", "Octavia Spencer", "Pierce Brosnan", "Rachel McAdams", "Reese Witherspoon",
    "Robert De Niro", "Robert Downey Jr", "Roger Moore", "Ryan Gosling", "Ryan Reynolds", "Samuel L Jackson",
    "Sandra Bullock", "Saoirse Ronan", "Scarlett Johansson", "Sean Connery", "Selena Gomez",
    "Sylvester Stallone", "Timothee Chalamet", "Tom Cruise", "Tom Hanks", "Tom Hardy", "Tom Holland",
    "Vin Diesel", "Viola Davis", "Will Smith", "Zendaya", "Zoe Saldana",
  ],
  youtubers: [
    "Abhishek Upmanyu", "Ajju Bhai", "Alakh Pandey", "Amit Bhadana", "Apna College", "Ashish Chanchlani",
    "Bhuvan Bam", "Biswa Kalyan Rath", "Carry Minati", "CodeWithHarry", "Dhruv Rathee", "Dynamo Gaming",
    "Elvish Yadav", "Flying Beast", "Fukra Insaan", "Gaurav Taneja", "Harsh Beniwal", "Kusha Kapila",
    "Lakshay Chaudhary", "Live Insaan", "Love Babbar", "Mortal", "Mostly Sane", "MrBeast", "Mumbiker Nikhil",
    "Mythpat", "Naman Mathur", "Payal Gaming", "PewDiePie", "Physics Wallah", "Prajakta Koli",
    "Ranveer Allahbadia", "Round2Hell", "Samay Raina", "Sandeep Maheshwari", "Scout", "Slayy Point",
    "Sourav Joshi", "T-Series", "Tanay Pratap", "Tanmay Bhat", "Technical Guruji", "Technical Sagar",
    "Thugesh", "Total Gaming", "Triggered Insaf", "Zakir Khan",
  ],
  cricketers: [
    "AB de Villiers", "Anil Kumble", "Babar Azam", "Ben Stokes", "Brian Lara", "Chris Gayle", "Dale Steyn",
    "David Warner", "Gautam Gambhir", "Glenn Maxwell", "Glenn McGrath", "Harbhajan Singh", "Hardik Pandya",
    "Imran Khan", "Jacques Kallis", "Jasprit Bumrah", "Joe Root", "Jofra Archer", "Jos Buttler", "KL Rahul",
    "Kane Williamson", "Kapil Dev", "Kuldeep Yadav", "Kumar Sangakkara", "MS Dhoni", "Mitchell Starc",
    "Mohammed Shami", "Mohammed Siraj", "Muttiah Muralitharan", "Pat Cummins", "Rahul Dravid", "Rashid Khan",
    "Ravichandran Ashwin", "Ravindra Jadeja", "Ricky Ponting", "Rishabh Pant", "Rohit Sharma",
    "Sachin Tendulkar", "Shaheen Afridi", "Shahid Afridi", "Shane Warne", "Shikhar Dhawan", "Shoaib Akhtar",
    "Shubman Gill", "Sourav Ganguly", "Steve Smith", "Sunil Gavaskar", "Suresh Raina", "Suryakumar Yadav",
    "VVS Laxman", "Virat Kohli", "Virender Sehwag", "Viv Richards", "Wasim Akram", "Yashasvi Jaiswal",
    "Yuvraj Singh", "Zaheer Khan",
  ],
  otherSports: [
    "Abhinav Bindra", "Bajrang Punia", "Bhaichung Bhutia", "Cristiano Ronaldo", "David Beckham",
    "Dhyan Chand", "Diego Maradona", "Dipa Karmakar", "Gukesh D", "John Cena", "Kylian Mbappe",
    "LeBron James", "Leander Paes", "Lewis Hamilton", "Lionel Messi", "Lovlina Borgohain", "Magnus Carlsen",
    "Mahesh Bhupathi", "Manu Bhaker", "Mary Kom", "Michael Jordan", "Michael Phelps", "Mike Tyson",
    "Milkha Singh", "Mirabai Chanu", "Muhammad Ali", "Neeraj Chopra", "Neymar", "Novak Djokovic", "PT Usha",
    "PV Sindhu", "Pele", "Pullela Gopichand", "Rafael Nadal", "Roger Federer", "Saina Nehwal", "Sakshi Malik",
    "Sania Mirza", "Serena Williams", "Sunil Chhetri", "Sushil Kumar", "The Great Khali", "Tiger Woods",
    "Usain Bolt", "Vinesh Phogat", "Viswanathan Anand",
  ],
  singers: [
    "50 Cent", "AP Dhillon", "AR Rahman", "Adele", "Alka Yagnik", "Amaal Mallik", "Ankit Tiwari",
    "Anup Jalota", "Ariana Grande", "Arijit Singh", "Armaan Malik", "Asha Bhosle", "Atif Aslam", "B Praak",
    "BTS", "Badshah", "Beyonce", "Billie Eilish", "Bob Marley", "Cardi B", "Coldplay", "Darshan Raval",
    "Diljit Dosanjh", "Divine", "Dr Dre", "Drake", "Dua Lipa", "Ed Sheeran", "Eminem", "Emiway Bantai",
    "Freddie Mercury", "Ghulam Ali", "Guru Randhawa", "Hariharan", "Himesh Reshammiya", "Honey Singh",
    "Jagjit Singh", "Jay Z", "Jubin Nautiyal", "Justin Bieber", "Kanye West", "Katy Perry", "Kendrick Lamar",
    "King", "Kishore Kumar", "Kumar Sanu", "Lady Gaga", "Lata Mangeshkar", "MC Stan", "Megan Thee Stallion",
    "Michael Jackson", "Mika Singh", "Mohammed Rafi", "Mohit Chauhan", "Mukesh", "Naezy", "Neha Kakkar",
    "Nicki Minaj", "Nusrat Fateh Ali Khan", "Pankaj Udhas", "Papon", "Prateek Kuhad", "Pritam", "Raftaar",
    "Rahat Fateh Ali Khan", "Rihanna", "Ritviz", "Shaan", "Shankar Ehsaan Loy", "Shreya Ghoshal",
    "Sidhu Moosewala", "Snoop Dogg", "Sonu Nigam", "Sukhwinder Singh", "Sunidhi Chauhan", "Taylor Swift",
    "Travis Scott", "Udit Narayan", "Vishal Shekhar", "Yo Yo Honey Singh",
  ],
  leaders: [
    "APJ Abdul Kalam", "Akbar", "Akhilesh Yadav", "Albert Einstein", "Amit Shah", "Anand Mahindra",
    "Arvind Kejriwal", "Ashoka", "Atal Bihari Vajpayee", "Azim Premji", "BR Ambedkar", "Barack Obama",
    "Bhagat Singh", "Bill Gates", "Byju Raveendran", "CV Raman", "Chanakya", "Chandrashekhar Azad",
    "Donald Trump", "Elon Musk", "Falguni Nayar", "Gautam Adani", "Homi Bhabha", "Indira Gandhi",
    "Isaac Newton", "Jawaharlal Nehru", "Kalpana Chawla", "Kiran Mazumdar Shaw", "Kumar Mangalam Birla",
    "Lal Bahadur Shastri", "Lalu Prasad Yadav", "Maharana Pratap", "Mahatma Gandhi", "Mamata Banerjee",
    "Manmohan Singh", "Mayawati", "Mukesh Ambani", "Napoleon", "Narayana Murthy", "Narendra Modi",
    "Nelson Mandela", "Nikhil Kamath", "Nirmala Sitharaman", "Nitin Gadkari", "Nitish Kumar",
    "Pranab Mukherjee", "Priyanka Gandhi", "Rabindranath Tagore", "Rahul Gandhi", "Raj Thackeray",
    "Rajiv Gandhi", "Rajnath Singh", "Rakesh Sharma", "Rani Lakshmibai", "Ratan Tata", "Ritesh Agarwal",
    "Sardar Patel", "Satya Nadella", "Sharad Pawar", "Shiv Nadar", "Shivaji", "Smriti Irani", "Sonia Gandhi",
    "Srinivasa Ramanujan", "Stephen Hawking", "Steve Jobs", "Subhas Chandra Bose", "Sundar Pichai",
    "Sushma Swaraj", "Swami Vivekananda", "Tim Cook", "Tipu Sultan", "Uddhav Thackeray",
    "Vijay Shekhar Sharma", "Warren Buffett", "Yogi Adityanath",
  ],
  mythology: [
    "Abhimanyu", "Agni", "Arjun", "Bharat", "Bhim", "Bhishma", "Brahma", "Chandra", "Draupadi", "Dronacharya",
    "Durga", "Duryodhan", "Ganesh", "Garuda", "Ghatotkach", "Hanuman", "Hiranyakashipu", "Indra", "Kali",
    "Kamdev", "Karn", "Kartikeya", "Krishna", "Kubera", "Lakshman", "Lakshmi", "Nakul", "Nandi", "Narad",
    "Parshuram", "Parvati", "Prahlad", "Radha", "Ram", "Ravan", "Sahadev", "Saraswati", "Shani", "Shesh Naag",
    "Shiv", "Sita", "Surya", "Valmiki", "Vamana", "Varun", "Vayu", "Vishnu", "Vishwamitra", "Vyas", "Yamraj",
    "Yudhishthir",
  ],
  },
  place: {
  indianCities: [
    "Agartala", "Agra", "Ahilyanagar", "Ahmedabad", "Aizawl", "Ajmer", "Akola", "Alwar", "Ambala", "Ambattur",
    "Amravati", "Amritsar", "Anantapur", "Arrah", "Aurangabad", "Avadi", "Ayodhya", "Ballari", "Baranagar",
    "Bareilly", "Bathinda", "Belagavi", "Bengaluru", "Bhavnagar", "Bhayandar", "Bhilai", "Bhilwara",
    "Bhiwandi", "Bhopal", "Bhubaneswar", "Bikaner", "Bilimora", "Bodh Gaya", "Borivli", "Brahmapur",
    "Chandigarh", "Chennai", "Coimbatore", "Cuttack", "Darbhanga", "Darjeeling", "Davangere", "Dehradun",
    "Delhi", "Dewas", "Dhanbad", "Dharamshala", "Dhule", "Dindigul", "Dombivali", "Durg", "Durgapur", "Erode",
    "Faridabad", "Gajuwaka", "Gandhinagar", "Gangtok", "Gaya", "Ghaziabad", "Gorakhpur", "Greater Noida",
    "Guntur", "Gurgaon", "Gurugram", "Guwahati", "Gwalior", "Hisar", "Howrah", "Hubballi", "Hyderabad",
    "Ichalkaranji", "Imphal", "Indore", "Itanagar", "Jabalpur", "Jaipur", "Jaisalmer", "Jalandhar", "Jalgaon",
    "Jammu", "Jamnagar", "Jamshedpur", "Jodhpur", "Kadapa", "Kalaburagi", "Kallakurichi", "Kanayannur",
    "Kanpur", "Karnal", "Kochi", "Kohima", "Kolkata", "Kollam", "Konark", "Korba", "Kota", "Kozhikode",
    "Kukatpally", "Kulti", "Kurnool", "Kurukshetra", "Kushinagar", "Lal Bahadur Nagar", "Latur", "Leh",
    "Loni", "Lucknow", "Ludhiana", "Madurai", "Maheshtala", "Malegaon", "Manali", "Mangaluru", "Mathura",
    "Meerut", "Mount Abu", "Mulugu", "Mumbai", "Mussoorie", "Muzaffarnagar", "Muzaffarpur", "Mysuru",
    "Nagpur", "Nainital", "Najafgarh", "Nanded", "Narela", "Nashik", "Navi Mumbai", "Nellore", "New Delhi",
    "Noida", "Nowrangapur", "Ooty", "Panaji", "Panipat", "Parbhani", "Patna", "Pimpri", "Pimpri-Chinchwad",
    "Pondicherry", "Prayagraj", "Puducherry", "Pune", "Puri", "Purnia", "Pushkar", "Raipur",
    "Rajamahendravaram", "Rajpur Sonarpur", "Ranchi", "Rohini", "Rohtak", "Rourkela", "Salem", "Satna",
    "Saugor", "Shillong", "Shimla", "Shirdi", "Shivaji Nagar", "Shivamogga", "Sholapur", "Shyamnagar",
    "Siliguri", "Sonipat", "Srinagar", "Surat", "Teni", "Thanjavur", "Thiruvananthapuram", "Thoothukudi",
    "Thrissur", "Tiruchirappalli", "Tirunelveli", "Tirupati", "Tiruppur", "Udaipur", "Ujjain", "Ulhasnagar",
    "Vadodara", "Varanasi", "Vellore", "Vijayapura", "Vijayawada", "Visakhapatnam", "Vrindavan", "Warangal",
  ],
  indianStates: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala",
    "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
  ],
  countries: [
    "Afghanistan", "Albania", "Algeria", "Angola", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bangladesh", "Belarus", "Belgium", "Benin", "Bolivia", "Bosnia and Herzegovina",
    "Botswana", "Brazil", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada",
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Cuba",
    "Czechia", "Democratic Republic of the Congo", "Denmark", "Dominican Republic", "Ecuador", "Egypt",
    "El Salvador", "Eritrea", "Ethiopia", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany",
    "Ghana", "Greece", "Guatemala", "Guinea", "Haiti", "Honduras", "Hong Kong", "Hungary", "India",
    "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", "Laos", "Lebanon", "Lesotho", "Liberia", "Libya",
    "Lithuania", "Madagascar", "Malawi", "Malaysia", "Mali", "Mauritania", "Mexico", "Moldova", "Mongolia",
    "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal", "New Zealand", "Nicaragua", "Niger", "Nigeria",
    "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palestinian Territory", "Panama",
    "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar",
    "Republic of the Congo", "Romania", "Russia", "Rwanda", "Saudi Arabia", "Senegal", "Serbia",
    "Serbia and Montenegro", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Somalia", "South Africa",
    "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria", "Taiwan",
    "Tajikistan", "Tanzania", "Thailand", "The Netherlands", "Togo", "Tunisia", "Turkey", "Turkmenistan",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
  ],
  worldCities: [
    "Abidjan", "Addis Ababa", "Alexandria", "Baghdad", "Bamako", "Bangkok", "Bao'an", "Beijing", "Cairo",
    "Cape Town", "Changchun", "Chattogram", "Chengdu", "Chongqing", "Dalian", "Dar es Salaam", "Dhaka",
    "Dongguan", "Foshan", "Giza", "Guangzhou", "Hangzhou", "Hanoi", "Harbin", "Hefei", "Ho Chi Minh City",
    "Hong Kong", "Istanbul", "Jakarta", "Jeddah", "Jinan", "Johannesburg", "Kabul", "Kano", "Karachi",
    "Kinshasa", "Kunming", "Lagos", "Lahore", "Lima", "London", "Los Angeles", "Melbourne", "Mexico City",
    "Moscow", "Nairobi", "Nanjing", "Nanning", "New Taipei City", "New Territories", "New York City",
    "Peshawar", "Pudong", "Puxi", "Qingdao", "Rio de Janeiro", "Riyadh", "Saint Petersburg", "Santiago",
    "Seoul", "Shanghai", "Shantou", "Shenyang", "Shenzhen", "Shijiazhuang", "Singapore", "Suzhou", "Sydney",
    "Taipei", "Taiyuan", "Tehran", "Tianjin", "Tokyo", "Wuhan", "Wuxi", "Wuzhong", "Xiamen", "Yangon",
    "Zhengzhou", "Zhongshan",
  ],
  famousPlaces: [
    "Ajanta", "Akshardham", "Amarnath", "Amber Fort", "Badrinath", "Big Ben", "Bollywood", "Brahmaputra",
    "Burj Khalifa", "Charminar", "City Palace", "Colosseum", "Eden Gardens", "Eiffel Tower", "Ellora",
    "Ganga", "Gateway of India", "Gir Forest", "Godavari", "Golden Temple", "Great Wall", "Hampi", "Haridwar",
    "Hawa Mahal", "Himalaya", "Hollywood", "Howrah Bridge", "Humayun Tomb", "India Gate", "Jama Masjid",
    "Jantar Mantar", "Jim Corbett", "Kanyakumari", "Kaziranga", "Kedarnath", "Khajuraho", "Kodaikanal",
    "Konark", "Lords", "Lotus Temple", "Machu Picchu", "Marina Beach", "Marine Drive", "Meenakshi Temple",
    "Mehrangarh", "Mount Everest", "Mount Fuji", "Munnar", "Mysore Palace", "Narmada", "Niagara Falls",
    "Nile", "Pyramids", "Qutub Minar", "Rann of Kutch", "Ranthambore", "Red Fort", "Rishikesh",
    "Sabarmati Ashram", "Sahara", "Spiti Valley", "Statue of Liberty", "Sundarbans", "Sydney Opera House",
    "Taj Mahal", "Thar Desert", "Times Square", "Tirupati Balaji", "Vaishno Devi", "Varanasi",
    "Victoria Memorial", "Wall Street", "Wankhede", "Yamuna",
  ],
  },
  animal: {
  animals: [
    "Alligator", "Alpaca", "Anaconda", "Anteater", "Antelope", "Arctic Fox", "Armadillo", "Baboon",
    "Bactrian Camel", "Badger", "Bandicoot", "Barasingha", "Bat", "Bear", "Beaver", "Bison", "Black Bear",
    "Blackbuck", "Boa", "Brown Bear", "Buffalo", "Bull", "Bullfrog", "Calf", "Camel", "Cat", "Chameleon",
    "Cheetah", "Chimpanzee", "Chinkara", "Chital", "Cobra", "Cougar", "Cow", "Coyote", "Crocodile", "Cub",
    "Deer", "Dingo", "Dog", "Dolphin", "Donkey", "Elephant", "Elk", "Ferret", "Foal", "Fox", "Frog",
    "Gangetic Dolphin", "Gazelle", "Gecko", "Gharial", "Gibbon", "Giraffe", "Goat", "Gorilla", "Grizzly Bear",
    "Hamster", "Hare", "Hedgehog", "Hen", "Himalayan Bear", "Hippopotamus", "Horse", "Hyena", "Iguana",
    "Indian Rhino", "Indian Wolf", "Jackal", "Jaguar", "Kangaroo", "King Cobra", "Kitten", "Koala",
    "Komodo Dragon", "Krait", "Lamb", "Langur", "Lemur", "Leopard", "Lion", "Lion Tailed Macaque", "Lizard",
    "Llama", "Lynx", "Manatee", "Mandrill", "Meerkat", "Mole", "Mongoose", "Monitor Lizard", "Moose", "Mouse",
    "Mugger Crocodile", "Mule", "Narwhal", "Newt", "Nilgai", "Okapi", "Orangutan", "Otter", "Ox", "Panda",
    "Pangolin", "Panther", "Pig", "Piglet", "Platypus", "Polar Bear", "Pony", "Porcupine", "Puma", "Puppy",
    "Python", "Rabbit", "Raccoon", "Rat", "Rattlesnake", "Red Fox", "Red Panda", "Reindeer", "Rhesus Monkey",
    "Rhino", "Rhinoceros", "Rooster", "Salamander", "Sambar", "Sea Lion", "Seal", "Sheep", "Skunk", "Sloth",
    "Sloth Bear", "Snake", "Snow Leopard", "Squirrel", "Tapir", "Tasmanian Devil", "Tiger", "Toad",
    "Tortoise", "Turtle", "Viper", "Walrus", "Warthog", "Whale", "Wild Boar", "Wolf", "Wombat", "Yak",
    "Zebra",
  ],
  birds: [
    "Bulbul", "Cockatoo", "Cormorant", "Crow", "Cuckoo", "Dove", "Drongo", "Duck", "Eagle", "Egret", "Emu",
    "Falcon", "Flamingo", "Goose", "Great Indian Bustard", "Hawk", "Hen", "Heron", "Hoopoe", "Hornbill",
    "Hummingbird", "Kingfisher", "Kite", "Kiwi", "Koel", "Lapwing", "Macaw", "Magpie", "Myna", "Nightingale",
    "Ostrich", "Owl", "Parakeet", "Parrot", "Partridge", "Peacock", "Peahen", "Pelican", "Penguin", "Pigeon",
    "Quail", "Raven", "Robin", "Rooster", "Sarus Crane", "Skylark", "Sparrow", "Starling", "Stork", "Sunbird",
    "Swallow", "Swan", "Swift", "Tailorbird", "Toucan", "Turkey", "Vulture", "Weaver", "Woodpecker", "Wren",
  ],
  fishAndSea: [
    "Barracuda", "Bombay Duck", "Carp", "Catfish", "Clam", "Clownfish", "Crab", "Dolphin", "Eel", "Goldfish",
    "Hilsa", "Jellyfish", "Katla", "Lobster", "Mackerel", "Magur", "Mahseer", "Octopus", "Oyster", "Pomfret",
    "Prawn", "Rohu", "Salmon", "Sardine", "Seahorse", "Shark", "Shrimp", "Singhi", "Squid", "Starfish",
    "Stingray", "Surmai", "Swordfish", "Tilapia", "Trout", "Tuna", "Whale Shark",
  ],
  insects: [
    "Ant", "Bedbug", "Bee", "Beetle", "Butterfly", "Caterpillar", "Centipede", "Cockroach", "Cricket",
    "Dragonfly", "Earthworm", "Firefly", "Fly", "Grasshopper", "Honeybee", "Hornet", "Housefly", "Ladybug",
    "Leech", "Locust", "Louse", "Millipede", "Mosquito", "Moth", "Praying Mantis", "Scorpion", "Silkworm",
    "Snail", "Spider", "Termite", "Wasp",
  ],
  },
  thing: {
  fruits: [
    "Amla", "Apple", "Apricot", "Avocado", "Bael", "Banana", "Ber", "Blackberry", "Blueberry", "Cherry",
    "Chikoo", "Chiku", "Coconut", "Cranberry", "Custard Apple", "Dates", "Dragon Fruit", "Falsa", "Fig",
    "Grapefruit", "Grapes", "Guava", "Jackfruit", "Jamun", "Karonda", "Kinnow", "Kiwi", "Lemon", "Lime",
    "Lychee", "Mango", "Mosambi", "Mulberry", "Muskmelon", "Nectarine", "Orange", "Papaya", "Passion Fruit",
    "Peach", "Pear", "Persimmon", "Phalsa", "Pineapple", "Plum", "Pomegranate", "Pomelo", "Raspberry",
    "Sapota", "Star Fruit", "Strawberry", "Tamarind", "Tangerine", "Tendu", "Watermelon",
  ],
  vegetables: [
    "Arbi", "Bathua", "Beans", "Beetroot", "Bhindi", "Bottle Gourd", "Brinjal", "Broccoli", "Cabbage",
    "Capsicum", "Carrot", "Cauliflower", "Celery", "Cluster Beans", "Coriander", "Corn", "Cucumber",
    "Curry Leaves", "Drumstick", "Garlic", "Ginger", "Gourd", "Green Chilli", "Kaddu", "Karela", "Lauki",
    "Lettuce", "Methi", "Mint", "Mushroom", "Onion", "Parwal", "Peas", "Potato", "Pumpkin", "Radish",
    "Raw Banana", "Ridge Gourd", "Sarson", "Spinach", "Sweet Potato", "Tinda", "Tomato", "Turai", "Turnip",
    "Yam", "Zucchini",
  ],
  flowers: [
    "Amaltas", "Bougainvillea", "Carnation", "Chameli", "Champa", "Chrysanthemum", "Cosmos", "Daffodil",
    "Dahlia", "Daisy", "Genda", "Gerbera", "Gladiolus", "Gudhal", "Gulab", "Gulmohar", "Hibiscus", "Iris",
    "Jasmine", "Kachnar", "Kamal", "Lavender", "Lily", "Lotus", "Magnolia", "Marigold", "Mogra", "Orchid",
    "Pansy", "Parijat", "Peony", "Petunia", "Poppy", "Raat Ki Rani", "Rajnigandha", "Rose", "Sunflower",
    "Surajmukhi", "Tesu", "Tuberose", "Tulip", "Violet", "Zinnia",
  ],
  trees: [
    "Aloe Vera", "Amla Tree", "Ashoka", "Babool", "Bamboo", "Banana Plant", "Banana Tree", "Banyan", "Baobab",
    "Birch", "Cedar", "Chinar", "Coconut Palm", "Cypress", "Deodar", "Eucalyptus", "Gulmohar", "Jamun Tree",
    "Mahogany", "Mahua", "Mango Tree", "Maple", "Neem", "Oak", "Palm", "Peepal", "Pine", "Redwood",
    "Rosewood", "Sal", "Sandalwood", "Sheesham", "Shisham", "Tamarind", "Teak", "Tulsi", "Willow",
  ],
  indianFoods: [
    "Aloo Gobi", "Aloo Paratha", "Amritsari Kulcha", "Appam", "Baingan Bharta", "Bajra Roti", "Barfi",
    "Basundi", "Bhel Puri", "Bhindi Masala", "Bhujia", "Biryani", "Bonda", "Butter Chicken", "Chaat", "Chai",
    "Chakli", "Chana Masala", "Chicken Tikka", "Chole Bhature", "Chutney", "Dahi Puri", "Dal Baati Churma",
    "Dal Makhani", "Dal Tadka", "Dhokla", "Dosa", "Egg Curry", "Fafda", "Falooda", "Filter Coffee",
    "Fish Curry", "Gajar Halwa", "Gatte Ki Sabzi", "Ghevar", "Gola", "Gulab Jamun", "Haleem", "Halwa",
    "Hyderabadi Biryani", "Idli", "Imarti", "Jalebi", "Jaljeera", "Kachori", "Kadai Paneer", "Kadhi",
    "Kaju Katli", "Kala Khatta", "Keema", "Ker Sangri", "Khakhra", "Khandvi", "Kheer", "Khichdi",
    "Kolkata Biryani", "Korma", "Kulcha", "Kulfi", "Laal Maas", "Ladoo", "Lassi", "Litti", "Litti Chokha",
    "Maggi", "Makki Di Roti", "Malai Kofta", "Malpua", "Masala Chai", "Masala Dosa", "Matar Paneer", "Mathri",
    "Mirchi Vada", "Misal Pav", "Mishti Doi", "Modak", "Momos", "Murukku", "Naan", "Namkeen", "Nihari",
    "Nimbu Pani", "Palak Paneer", "Paneer Tikka", "Pani Puri", "Papad", "Paratha", "Pav Bhaji", "Peda",
    "Pesarattu", "Pickle", "Poha", "Prawn Masala", "Pulao", "Puran Poli", "Puri", "Puttu", "Pyaaz Kachori",
    "Rabri", "Raita", "Rajma Chawal", "Rasgulla", "Rasmalai", "Rogan Josh", "Rosogolla", "Roti",
    "Sabudana Khichdi", "Sambar", "Samosa", "Sandesh", "Sarson Da Saag", "Seekh Kebab", "Sev Puri",
    "Shahi Paneer", "Shrikhand", "Tandoori Chicken", "Thandai", "Thepla", "Upma", "Uttapam", "Vada",
    "Vada Pav", "Vindaloo",
  ],
  sweetsAndDrinks: [
    "Biscuit", "Boost", "Bournvita", "Bread", "Brownie", "Burger", "Butter", "Cake", "Cheese", "Chocolate",
    "Coffee", "Coke", "Complan", "Cookie", "Curd", "Donut", "Fanta", "French Fries", "Fried Rice", "Frooti",
    "Ghee", "Horlicks", "Hot Dog", "Ice Cream", "Juice", "Limca", "Maaza", "Manchurian", "Milk", "Noodles",
    "Paneer", "Pasta", "Pastry", "Pepsi", "Pizza", "Rooh Afza", "Sandwich", "Soda", "Spring Roll", "Sprite",
    "Tea", "Thums Up",
  ],
  vehicles: [
    "Activa", "Airplane", "Alto", "Ambassador", "Ambulance", "Auto Rickshaw", "Bicycle", "Bike", "Boat",
    "Bullet", "Bullock Cart", "Bus", "Cab", "Car", "Cruiser", "Cycle", "Cycle Rickshaw", "E Rickshaw",
    "Ferry", "Fortuner", "Helicopter", "Houseboat", "Hovercraft", "Innova", "Jeep", "Local Train", "Metro",
    "Minibus", "Motorcycle", "Nano", "Pulsar", "Rickshaw", "Rocket", "Scooter", "Scorpio", "Segway",
    "Shikara", "Ship", "Skateboard", "Splendor", "Submarine", "Swift", "Taxi", "Tempo", "Thar", "Tonga",
    "Tractor", "Train", "Truck", "Tuk Tuk", "Van",
  ],
  clothing: [
    "Achkan", "Bangles", "Belt", "Bindi", "Blazer", "Boots", "Burqa", "Cap", "Chappal", "Churidar", "Dhoti",
    "Dupatta", "Gamchha", "Gloves", "Hat", "Hijab", "Hoodie", "Jacket", "Jeans", "Jhumka", "Jutti", "Kajal",
    "Kimono", "Kolhapuri", "Kurta", "Kurti", "Lehenga", "Lungi", "Maang Tikka", "Mangalsutra", "Mehendi",
    "Mojari", "Nath", "Nehru Jacket", "Pagri", "Pashmina", "Patiala", "Payal", "Poncho", "Salwar", "Sandal",
    "Saree", "Scarf", "Shawl", "Sherwani", "Shirt", "Shoes", "Shorts", "Sneakers", "Socks", "Stole",
    "Sweater", "T Shirt", "Tie", "Trousers", "Turban", "Uniform", "Watch",
  ],
  householdThings: [
    "Agarbatti", "Almirah", "Bag", "Blanket", "Broom", "Brush", "Bucket", "Bulb", "Calendar", "Camera",
    "Candle", "Carrom Board", "Cello Tape", "Chair", "Chakla Belan", "Chalk", "Charger", "Charpai", "Chulha",
    "Clock", "Comb", "Compass", "Cooler", "Cot", "Cricket Bat", "Dhoop", "Diya", "Dustbin", "Duster",
    "Earphones", "Eraser", "Fan", "Fevicol", "Fork", "Fridge", "Geyser", "Gilli", "Glass", "Hukka",
    "Inverter", "Jug", "Kadhai", "Katori", "Key", "Kite", "Knife", "Ladle", "Lantern", "Laptop", "Lighter",
    "Lock", "Lota", "Mandir", "Manjha", "Marbles", "Matchbox", "Matka", "Mattress", "Mirror", "Mixer Grinder",
    "Mobile", "Mop", "Mug", "Notebook", "Pan", "Pen", "Pencil", "Pillow", "Plate", "Pressure Cooker", "Quilt",
    "Raincoat", "Rangoli", "Remote", "Ruler", "Scissors", "Sharpener", "Shelf", "Sieve", "Silbatta", "Slate",
    "Soap", "Sofa", "Spoon", "Stapler", "Suitcase", "Table", "Tawa", "Thali", "Tiffin", "Tongs", "Top",
    "Torch", "Towel", "Tubelight", "Umbrella", "Wallet", "Washing Machine",
  ],
  instruments: [
    "Accordion", "Algoza", "Bagpipe", "Banjo", "Bansuri", "Bongo", "Cello", "Clarinet", "Cymbals", "Dafli",
    "Damru", "Dhol", "Dholak", "Dholki", "Drums", "Ektara", "Flute", "Ghatam", "Guitar", "Harmonium", "Harp",
    "Keyboard", "Khartal", "Mandolin", "Manjira", "Morsing", "Mridangam", "Nagada", "Piano", "Pungi", "Rabab",
    "Santoor", "Sarangi", "Sarod", "Saxophone", "Shehnai", "Sitar", "Tabla", "Tambourine", "Tanpura",
    "Trumpet", "Ukulele", "Veena", "Violin", "Xylophone",
  ],
  sports: [
    "Aikido", "Archery", "Athletics", "Badminton", "Baseball", "Basketball", "Boxing", "Carrom", "Chess",
    "Cricket", "Cycling", "Discus", "Football", "Gilli Danda", "Golf", "Gymnastics", "High Jump", "Hockey",
    "Javelin", "Judo", "Kabaddi", "Karate", "Kho Kho", "Kushti", "Lagori", "Long Jump", "Mallakhamb",
    "Marathon", "Pickleball", "Pittu", "Polo", "Rugby", "Shooting", "Skating", "Snooker", "Squash", "Surfing",
    "Swimming", "Table Tennis", "Taekwondo", "Tennis", "Throwball", "Volleyball", "Weightlifting",
    "Wrestling", "Yoga",
  ],
  professions: [
    "Accountant", "Actor", "Architect", "Astrologer", "Astronaut", "Baker", "Banker", "Barber", "Blacksmith",
    "Butcher", "Carpenter", "Chaiwala", "Chef", "Clerk", "Cobbler", "Collector", "Conductor", "Cook",
    "Dancer", "Dentist", "Designer", "Developer", "Dhobi", "Director", "Doctor", "Driver", "Electrician",
    "Engineer", "Farmer", "Fireman", "Fisherman", "Gardener", "Goldsmith", "Halwai", "Jeweller", "Journalist",
    "Judge", "Lawyer", "Magician", "Maulvi", "Mayor", "Mechanic", "Milkman", "Minister", "Nurse", "Painter",
    "Pandit", "Panwala", "Peon", "Pharmacist", "Photographer", "Pilot", "Plumber", "Poet", "Policeman",
    "Postman", "Potter", "Priest", "Principal", "Professor", "Programmer", "Sailor", "Sarpanch", "Scientist",
    "Shopkeeper", "Singer", "Soldier", "Sweeper", "Tailor", "Teacher", "Vet", "Waiter", "Watchman", "Weaver",
    "Writer",
  ],
  colors: [
    "Beige", "Bhura", "Black", "Blue", "Brown", "Coral", "Crimson", "Cyan", "Gold", "Green", "Grey", "Gulabi",
    "Hara", "Indigo", "Jamuni", "Kala", "Kesariya", "Lal", "Lavender", "Magenta", "Maroon", "Mint", "Navy",
    "Neela", "Olive", "Orange", "Peach", "Peela", "Pink", "Purple", "Red", "Safed", "Saffron", "Scarlet",
    "Silver", "Teal", "Turquoise", "Violet", "White", "Yellow",
  ],
  gems: [
    "Agate", "Amber", "Amethyst", "Brass", "Bronze", "Copper", "Coral", "Diamond", "Emerald", "Garnet",
    "Gold", "Heera", "Iron", "Jade", "Manik", "Moonstone", "Moti", "Neelam", "Onyx", "Opal", "Panna", "Pearl",
    "Peridot", "Platinum", "Pukhraj", "Ruby", "Sapphire", "Silver", "Steel", "Topaz", "Turquoise", "Zircon",
  ],
  brands: [
    "AMD", "Acer", "Adidas", "Air India", "Airtel", "Allen Solly", "Amazon", "Amul", "Apple", "Ariel",
    "Asian Paints", "Asus", "Audi", "Axis Bank", "BMW", "Bajaj", "Bajaj Electricals", "Bata", "Bentley",
    "Berger", "Biba", "Big Bazaar", "BigBasket", "Bikaji", "Bingo", "Blinkit", "Blue Star", "Britannia",
    "Burger King", "Byjus", "Cadbury", "Cafe Coffee Day", "Campus", "Chanel", "Chevrolet", "Coca Cola",
    "Colgate", "Cred", "DMart", "Dabur", "Daikin", "Dairy Milk", "Dell", "Dettol", "Dior", "Dominos", "Dove",
    "Ducati", "Duracell", "Eveready", "Fabindia", "Facebook", "Fanta", "Fastrack", "Ferrari", "Fevicol",
    "Five Star", "Flipkart", "Ford", "Frooti", "Godrej", "Google", "Google Pay", "Groww", "Gucci", "H&M",
    "HCL", "HDFC", "Haldirams", "Harley Davidson", "Harpic", "Havells", "Hero", "Himalaya", "Honda",
    "Hyundai", "ICICI", "IRCTC", "IndiGo", "Infosys", "Instagram", "Intel", "Jaguar", "Jet Airways", "Jio",
    "KFC", "Kawasaki", "Kia", "Kingfisher", "KitKat", "Kurkure", "LIC", "Lakme", "Lamborghini", "Land Rover",
    "Lays", "Lenovo", "Lenskart", "Levis", "Liberty", "Lifebuoy", "Limca", "Louis Vuitton", "Lux", "Maaza",
    "Maggi", "Mahindra", "MakeMyTrip", "Mamaearth", "Manyavar", "Mars", "Maruti", "Maybelline", "Mazda",
    "McDonalds", "Meesho", "Mercedes", "Meta", "Microsoft", "Monster", "Mother Dairy", "Motorola", "Munch",
    "Myntra", "Nestle", "Netflix", "Nike", "Nintendo", "Nissan", "Noise", "Nokia", "Nvidia", "Nykaa", "OYO",
    "Ola", "OnePlus", "Oppo", "Oreo", "Panasonic", "Paragon", "Parle", "Parle G", "Patanjali", "Paytm",
    "Pepsi", "Pepsodent", "Perk", "Peter England", "Philips", "PhonePe", "Pidilite", "Pizza Hut",
    "PlayStation", "Porsche", "Prada", "Pringles", "Puma", "Qualcomm", "Ray Ban", "Raymond", "Realme",
    "Red Bull", "Reebok", "Reliance", "Reliance Trends", "Renault", "Rolex", "Rolls Royce", "Royal Enfield",
    "SBI", "Samsung", "Skoda", "Skybags", "Snickers", "Sony", "SpiceJet", "Spotify", "Sprite", "Starbucks",
    "Subway", "Surf Excel", "Suzuki", "Swiggy", "TCS", "TVS", "Taj Hotels", "Tata", "Tata Tea", "Tesla",
    "Thums Up", "Tide", "Titan", "Toyota", "Twitter", "Uber", "Unacademy", "Under Armour", "Usha",
    "Van Heusen", "Vim", "Vistara", "Vivo", "Vodafone", "Volkswagen", "Voltas", "WhatsApp", "Whirlpool",
    "Wildcraft", "Wipro", "Woodland", "Xbox", "Xiaomi", "Yamaha", "YouTube", "Zara", "Zepto", "Zerodha",
    "Zomato", "Zudio", "boAt",
  ],
  },
  entertainment: {
  indianMovies: [
    "2.0", "3 Idiots", "Adipurush", "Airlift", "Andhadhun", "Animal", "Arjun Reddy", "Article 15",
    "Baahubali", "Baahubali 2", "Baby", "Badhaai Ho", "Bajirao Mastani", "Bajrangi Bhaijaan",
    "Bangalore Days", "Barfi", "Bhool Bhulaiyaa", "Bigil", "Black", "Bodyguard", "Bol Bachchan", "Brahmastra",
    "Chak De India", "Chennai Express", "Dabangg", "Dangal", "Devdas", "Dhamaal", "Dhoom", "Dhoom 2",
    "Dilwale Dulhania Le Jayenge", "Dream Girl", "Drishyam", "Dunki", "Eega", "Ek Tha Tiger", "Enthiran",
    "Fighter", "Gadar", "Gadar 2", "Golmaal", "Gully Boy", "Happy New Year", "Hera Pheri", "Holiday",
    "Housefull", "Jailer", "Jawan", "KGF", "KGF Chapter 2", "Kaala", "Kabali", "Kabhi Alvida Naa Kehna",
    "Kabhi Khushi Kabhie Gham", "Kabir Singh", "Kahaani", "Kaithi", "Kal Ho Naa Ho", "Kalki 2898 AD",
    "Kantara", "Kesari", "Kick", "Koi Mil Gaya", "Krrish", "Kuch Kuch Hota Hai", "Lagaan",
    "Lage Raho Munna Bhai", "Leo", "Lucifer", "Magadheera", "Manjummel Boys", "Master", "Mother India",
    "Mughal E Azam", "Munna Bhai MBBS", "Om Shanti Om", "Pad Man", "Padmaavat", "Padman", "Pathaan",
    "Phir Hera Pheri", "Premam", "Pushpa", "Pushpa 2", "Queen", "RRR", "Raazi", "Race 3", "Radhe Shyam",
    "Ram Leela", "Rang De Basanti", "Robot", "Rockstar", "Rowdy Rathore", "Saaho", "Salaar", "Sholay",
    "Simmba", "Singham", "Sita Ramam", "Sivaji", "Sooryavanshi", "Special 26", "Stree", "Sultan", "Swades",
    "Taare Zameen Par", "Tamasha", "Tiger 3", "Tiger Zinda Hai", "Toilet Ek Prem Katha",
    "Uri The Surgical Strike", "Vikram", "Wake Up Sid", "Wanted", "War", "Welcome", "Yeh Jawaani Hai Deewani",
    "Zindagi Na Milegi Dobara",
  ],
  hollywoodMovies: [
    "300", "Alien", "Aliens", "Ant Man", "Aquaman", "Avatar", "Avengers Endgame", "Avengers Infinity War",
    "Back to the Future", "Batman Begins", "Black Panther", "Black Widow", "Braveheart", "Captain America",
    "Casino", "Catch Me If You Can", "Close Encounters", "Deadpool", "Django Unchained", "Doctor Strange",
    "Dunkirk", "Eternals", "Fight Club", "Forrest Gump", "Gladiator", "Gone Girl", "Goodfellas",
    "Guardians of the Galaxy", "Heat", "Inception", "Indiana Jones", "Inglourious Basterds", "Interstellar",
    "Iron Man", "Jackie Brown", "Jaws", "Joker", "Jurassic Park", "Justice League", "Kill Bill", "Logan",
    "Man of Steel", "Memento", "Oppenheimer", "Predator", "Pulp Fiction", "Raging Bull",
    "Raiders of the Lost Ark", "Reservoir Dogs", "Return of the Jedi", "RoboCop", "Rogue One",
    "Saving Private Ryan", "Scarface", "Schindlers List", "Se7en", "Shang Chi", "Shazam", "Shutter Island",
    "Spider Man No Way Home", "Star Trek", "Star Wars", "Suicide Squad", "Superman", "Taxi Driver", "Tenet",
    "Terminator", "Terminator 2", "The Avengers", "The Batman", "The Dark Knight", "The Dark Knight Rises",
    "The Departed", "The Empire Strikes Back", "The Flash", "The Force Awakens", "The Godfather",
    "The Mandalorian", "The Prestige", "The Revenant", "The Social Network", "The Wolf of Wall Street",
    "Thor Ragnarok", "Titanic", "Troy", "Wolverine", "Wonder Woman", "X Men", "Zodiac",
  ],
  tvShows: [
    "Asur", "Better Call Saul", "Big Bang Theory", "Bigg Boss", "Black Mirror", "Breaking Bad", "Bridgerton",
    "Brooklyn Nine Nine", "Byomkesh Bakshi", "CID", "Chernobyl", "Dark", "Delhi Crime", "Dexter",
    "Doctor Who", "Doraemon", "Emily in Paris", "Family Guy", "Farzi", "Friends", "Futurama",
    "Game of Thrones", "Grey's Anatomy", "Homeland", "House", "House of the Dragon", "How I Met Your Mother",
    "Indian Idol", "Kapil Sharma Show", "Kaun Banega Crorepati", "Kota Factory",
    "Kyunki Saas Bhi Kabhi Bahu Thi", "Loki", "Lost", "Lucifer", "Mad Men", "Mahabharat", "Malgudi Days",
    "Mindhunter", "Mirzapur", "Modern Family", "Money Heist", "Moon Knight", "Narcos", "Ozark", "Paatal Lok",
    "Panchayat", "Parks and Recreation", "Peaky Blinders", "Prison Break", "Ramayan", "Rick and Morty",
    "Sacred Games", "Scam 1992", "Seinfeld", "Shaktimaan", "Shark Tank India", "Sherlock", "South Park",
    "Special Ops", "Stranger Things", "Succession", "Suits", "TVF Pitchers",
    "Taarak Mehta Ka Ooltah Chashmah", "Ted Lasso", "The Boys", "The Crown", "The Family Man", "The Office",
    "The Simpsons", "The Sopranos", "The Walking Dead", "The Wire", "The Witcher", "Tom and Jerry", "Vikings",
    "WandaVision", "Wednesday",
  ],
  games: [
    "2048", "Among Us", "Angry Birds", "Animal Crossing", "Apex Legends", "Asphalt 9", "Assassins Creed",
    "BGMI", "Backgammon", "Baldurs Gate", "Battleship", "Bloodborne", "Brawl Stars", "Breath of the Wild",
    "Bridge", "Call of Duty", "Candy Crush", "Carrom", "Carrom Pool", "Catan", "Celeste", "Checkers", "Chess",
    "Clash Royale", "Clash of Clans", "Cluedo", "Connect Four", "Counter Strike", "Crossword", "Cuphead",
    "Cut the Rope", "Cyberpunk 2077", "Dark Souls", "Dead Space", "Diablo", "Donkey Kong", "Dota 2",
    "Dragon Age", "Dragon Quest", "EA FC", "Elden Ring", "Elder Scrolls", "FIFA", "Fall Guys", "Fallout",
    "Far Cry", "Fate Grand Order", "Final Fantasy", "Flappy Bird", "Fortnite", "Forza Horizon", "Free Fire",
    "Fruit Ninja", "GTA V", "Genshin Impact", "Ghost of Tsushima", "God of War", "Gran Turismo",
    "Grand Theft Auto", "Hades", "Hangman", "Hearthstone", "Hollow Knight", "Honkai Star Rail",
    "Horizon Zero Dawn", "Jenga", "Kingdom Hearts", "Kirby", "League of Legends", "Legend of Zelda", "Ludo",
    "Ludo King", "Madden NFL", "Mario Kart", "Mass Effect", "Metroid", "Minecraft", "Monopoly",
    "Mortal Kombat", "NBA 2K", "Need for Speed", "Oblivion", "Overwatch", "PUBG", "Pac Man", "Pictionary",
    "Plants vs Zombies", "Pokemon Go", "Pokemon Red", "Poker", "Pong", "Prince of Persia",
    "Rainbow Six Siege", "Red Dead Redemption", "Resident Evil", "Risk", "Roblox", "Rocket League", "Rummy",
    "San Andreas", "Scrabble", "Sekiro", "Silent Hill", "Skyrim", "Snake", "Snakes and Ladders", "Solitaire",
    "Sonic the Hedgehog", "Space Invaders", "Spider Man PS4", "Splinter Cell", "StarCraft", "Stardew Valley",
    "Street Fighter", "Subway Surfers", "Sudoku", "Super Mario Bros", "Super Mario Odyssey",
    "Super Smash Bros", "Teen Patti", "Tekken", "Temple Run", "Terraria", "Tetris", "The Last of Us",
    "The Witcher 3", "Tic Tac Toe", "Uncharted", "Undertale", "Uno", "Valorant", "Vice City", "WWE 2K",
    "Warcraft", "Warzone", "Watch Dogs", "Wordle", "World of Warcraft", "eFootball",
  ],
  },
};

/** Flat list of every unique word (case-insensitive de-dupe). */
export const ALL_WORDS = (() => {
  const seen = new Set();
  const out = [];
  for (const group of Object.values(WORD_POOL)) {
    for (const words of Object.values(group)) {
      for (const w of words) {
        const key = w.toLowerCase();
        if (!seen.has(key)) { seen.add(key); out.push(w); }
      }
    }
  }
  return out;
})();

/** All category names (e.g. "animals", "youtubers") and group names (e.g. "animal"). */
export const GROUPS = Object.keys(WORD_POOL);
export const CATEGORIES = GROUPS.flatMap((g) => Object.keys(WORD_POOL[g]));

/** Get every word in a category ("fruits") or group ("thing"). Returns [] if unknown. */
export function getWordsByCategory(key) {
  if (WORD_POOL[key]) return Object.values(WORD_POOL[key]).flat();
  for (const g of GROUPS) if (WORD_POOL[g][key]) return WORD_POOL[g][key];
  return [];
}

/**
 * Random word.
 * @param {string|null} key  category / group name, or null for the whole pool
 * @param {{minLen?:number,maxLen?:number,singleWord?:boolean,exclude?:string[]}} opts
 */
export function getRandomWord(key = null, opts = {}) {
  const { minLen = 0, maxLen = Infinity, singleWord = false, exclude = [] } = opts;
  const ex = new Set(exclude.map((w) => w.toLowerCase()));
  const list = (key ? getWordsByCategory(key) : ALL_WORDS).filter((w) => {
    const len = w.replace(/\s/g, '').length;
    return len >= minLen && len <= maxLen && (!singleWord || !w.includes(' ')) && !ex.has(w.toLowerCase());
  });
  return list.length ? list[Math.floor(Math.random() * list.length)] : null;
}

/** Find which category a word belongs to (case-insensitive). */
export function findCategory(word) {
  const q = word.trim().toLowerCase();
  const hits = [];
  for (const g of GROUPS)
    for (const [c, words] of Object.entries(WORD_POOL[g]))
      if (words.some((w) => w.toLowerCase() === q)) hits.push(c);
  return hits;
}

/** Simple substring / prefix search. */
export function searchWords(query, limit = 20) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const starts = ALL_WORDS.filter((w) => w.toLowerCase().startsWith(q));
  const contains = ALL_WORDS.filter((w) => !w.toLowerCase().startsWith(q) && w.toLowerCase().includes(q));
  return [...starts, ...contains].slice(0, limit);
}

/** Validate a player's answer: does it start with the letter and exist in the category? */
export function isValidAnswer(key, letter, answer) {
  const a = answer.trim().toLowerCase();
  return a.startsWith(letter.toLowerCase()) && getWordsByCategory(key).some((w) => w.toLowerCase() === a);
}

export default WORD_POOL;