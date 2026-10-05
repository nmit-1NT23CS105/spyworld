package com.game.infinitequest.service;

import com.game.infinitequest.model.WordPair;
import com.game.infinitequest.model.CustomWordPairEntity;
import com.game.infinitequest.model.dto.CustomVsRequest;
import com.game.infinitequest.repository.CustomWordPairRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class WordPackService {

    private final CustomWordPairRepository customWordPairRepo;
    private final Map<String, List<WordPair>> packs = new ConcurrentHashMap<>();
    private final Random random = new Random();

    @PostConstruct
    public void initPacks() {
        packs.put("FOOD", initFoodPacks());
        packs.put("TECH", initTechPacks());
        packs.put("SPORTS", initSportsPacks());
        packs.put("CAMPUS", initCampusPacks());
        packs.put("TRAVEL", initTravelPacks());
        packs.put("LIFESTYLE", initLifestylePacks());
        packs.put("ANIMALS", initAnimalsPacks());
        packs.put("CAREERS", initCareersPacks());
        packs.put("MOVIES", initMoviesPacks());

        // Load or seed persistent custom VS pairs from database
        try {
            List<CustomWordPairEntity> saved = customWordPairRepo.findAll();
            if (saved.isEmpty() || saved.size() < 10) {
                List<CustomWordPairEntity> seedVs = List.of(
                        createVsEntity("Coffee", "Tea"),
                        createVsEntity("iPhone", "Android"),
                        createVsEntity("Marvel", "DC"),
                        createVsEntity("Biryani", "Pulao"),
                        createVsEntity("Messi", "Ronaldo"),
                        createVsEntity("Pizza", "Burger"),
                        createVsEntity("Summer", "Winter"),
                        createVsEntity("Instagram", "Snapchat"),
                        createVsEntity("Netflix", "YouTube"),
                        createVsEntity("Batman", "Superman"),
                        createVsEntity("Pet Dog", "Pet Cat"),
                        createVsEntity("MacBook", "Windows PC"),
                        createVsEntity("PlayStation", "Xbox"),
                        createVsEntity("Early Bird", "Night Owl"),
                        createVsEntity("Mountain Trek", "Beach Holiday"),
                        createVsEntity("Harry Potter", "Lord of the Rings"),
                        createVsEntity("Gym Workout", "Morning Yoga"),
                        createVsEntity("Coca-Cola", "Pepsi"),
                        createVsEntity("Money Heist", "Squid Game"),
                        createVsEntity("Paperback Book", "Kindle E-Reader"),
                        createVsEntity("Swiggy", "Zomato"),
                        createVsEntity("Uber", "Ola"),
                        createVsEntity("Virat Kohli", "Rohit Sharma"),
                        createVsEntity("RRR", "K.G.F"),
                        createVsEntity("Dark Mode", "Light Mode")
                );
                customWordPairRepo.saveAll(seedVs);
                saved = customWordPairRepo.findAll();
            }

            List<WordPair> customPairs = new ArrayList<>();
            for (CustomWordPairEntity e : saved) {
                customPairs.add(new WordPair(e.getCategory() != null ? e.getCategory() : "CUSTOM_VS", e.getWordA(), e.getWordB()));
            }
            packs.put("CUSTOM_VS", customPairs);
        } catch (Exception e) {
            System.err.println("Notice: Could not load custom pairs from DB on startup: " + e.getMessage());
        }
    }

    private CustomWordPairEntity createVsEntity(String a, String b) {
        return CustomWordPairEntity.builder()
                .category("CUSTOM_VS")
                .wordA(a)
                .wordB(b)
                .createdAt(System.currentTimeMillis())
                .build();
    }

    // 1. FOOD & DRINKS (60 pairs)
    private List<WordPair> initFoodPacks() {
        return new ArrayList<>(List.of(
                new WordPair("FOOD", "Biryani", "Pulao"),
                new WordPair("FOOD", "Chai (Tea)", "Filter Coffee"),
                new WordPair("FOOD", "Masala Dosa", "Idli Vada"),
                new WordPair("FOOD", "Pizza", "Burger"),
                new WordPair("FOOD", "Pani Puri", "Sev Puri"),
                new WordPair("FOOD", "Samosa", "Kachori"),
                new WordPair("FOOD", "Maggi Noodles", "Cup Noodles"),
                new WordPair("FOOD", "Ice Cream", "Matka Kulfi"),
                new WordPair("FOOD", "Dark Chocolate", "Pastry Cake"),
                new WordPair("FOOD", "Tandoori Roti", "Butter Naan"),
                new WordPair("FOOD", "Chicken Shawarma", "Egg Roll"),
                new WordPair("FOOD", "Butter Chicken", "Paneer Butter Masala"),
                new WordPair("FOOD", "Gulab Jamun", "Rasgulla"),
                new WordPair("FOOD", "French Fries", "Potato Chips"),
                new WordPair("FOOD", "Mint Mojito", "Lemon Soda"),
                new WordPair("FOOD", "Sweet Lassi", "Spiced Buttermilk"),
                new WordPair("FOOD", "Popcorn", "Cheese Nachos"),
                new WordPair("FOOD", "Alphonso Mango", "Sweet Watermelon"),
                new WordPair("FOOD", "Mirchi Bajji", "Punugulu"),
                new WordPair("FOOD", "Gongura Mutton", "Andhra Chicken Curry"),
                new WordPair("FOOD", "Pav Bhaji", "Chole Bhature"),
                new WordPair("FOOD", "Momos (Dumplings)", "Crispy Spring Rolls"),
                new WordPair("FOOD", "Garlic Bread", "Cheese Pizza Slice"),
                new WordPair("FOOD", "Hot Chocolate", "Cold Brew Coffee"),
                new WordPair("FOOD", "Fluffy Pancakes", "Belgian Waffles"),
                new WordPair("FOOD", "Gulab Jamun", "Hot Jalebi"),
                new WordPair("FOOD", "Masala Chai", "Herbal Green Tea"),
                new WordPair("FOOD", "Coca-Cola", "Pepsi"),
                new WordPair("FOOD", "Red Bull", "Monster Energy"),
                new WordPair("FOOD", "French Croissant", "Glazed Donut"),
                new WordPair("FOOD", "Guacamole", "Hummus Dip"),
                new WordPair("FOOD", "Mexican Tacos", "Loaded Burrito"),
                new WordPair("FOOD", "Japanese Sushi", "Hot Ramen"),
                new WordPair("FOOD", "Fried Rice", "Hakka Noodles"),
                new WordPair("FOOD", "White Alfredo Pasta", "Red Arrabiata Pasta"),
                new WordPair("FOOD", "Chicken 65", "Chilli Chicken"),
                new WordPair("FOOD", "Dal Tadka", "Dal Makhani"),
                new WordPair("FOOD", "Brown Bread", "White Milk Bread"),
                new WordPair("FOOD", "Peanut Butter", "Hazelnut Nutella"),
                new WordPair("FOOD", "Greek Yogurt", "Fruit Smoothie"),
                new WordPair("FOOD", "BBQ Chicken Wings", "Tandoori Chicken"),
                new WordPair("FOOD", "Kaju Katli", "Motichoor Laddu"),
                new WordPair("FOOD", "Poha", "Upma"),
                new WordPair("FOOD", "Puri Bhaji", "Aloo Paratha"),
                new WordPair("FOOD", "Mysurpa", "Mysore Pak"),
                new WordPair("FOOD", "Sweet Rasmalai", "Creamy Basundi"),
                new WordPair("FOOD", "Rose Falooda", "Chocolate Milkshake"),
                new WordPair("FOOD", "Sweet Corn Cup", "Roasted Bhutta (Corn Cob)"),
                new WordPair("FOOD", "Sizzling Brownie", "Choco Lava Cake"),
                new WordPair("FOOD", "Cheese Fondue", "Cheese Dip"),
                new WordPair("FOOD", "Hyderabadi Chicken Biryani", "Lucknowi Mutton Biryani"),
                new WordPair("FOOD", "Chicken Tikka Kebab", "Paneer Tikka"),
                new WordPair("FOOD", "Fish Fry", "Crispy Prawns"),
                new WordPair("FOOD", "Caesar Salad", "Fresh Fruit Bowl"),
                new WordPair("FOOD", "Onion Pakoda", "Bread Pakoda"),
                new WordPair("FOOD", "Fluffy Omelette", "Scrambled Eggs"),
                new WordPair("FOOD", "Tender Coconut Water", "Sugarcane Juice"),
                new WordPair("FOOD", "Mango Lassi", "Sweet Chaas"),
                new WordPair("FOOD", "Oreo Biscuit", "Bourbon Biscuit"),
                new WordPair("FOOD", "Kulfi Falooda", "Ice Cream Sundae")
        ));
    }

    // 2. TECH & GADGETS (60 pairs)
    private List<WordPair> initTechPacks() {
        return new ArrayList<>(List.of(
                new WordPair("TECH", "iPhone (iOS)", "Android Phone"),
                new WordPair("TECH", "MacBook", "Windows Laptop"),
                new WordPair("TECH", "ChatGPT", "Google Gemini"),
                new WordPair("TECH", "WhatsApp", "Telegram"),
                new WordPair("TECH", "Instagram", "Snapchat"),
                new WordPair("TECH", "Python", "Java"),
                new WordPair("TECH", "Swiggy", "Zomato"),
                new WordPair("TECH", "Uber", "Ola Cabs"),
                new WordPair("TECH", "Over-Ear Headphones", "Wireless Earbuds"),
                new WordPair("TECH", "Smartwatch", "Classic Analog Watch"),
                new WordPair("TECH", "PlayStation 5", "Xbox Series X"),
                new WordPair("TECH", "High-speed WiFi", "5G Mobile Data"),
                new WordPair("TECH", "Google", "Microsoft"),
                new WordPair("TECH", "Dark Mode", "Light Mode"),
                new WordPair("TECH", "Mechanical Keyboard", "Touchscreen Tablet"),
                new WordPair("TECH", "GitHub", "Google Drive"),
                new WordPair("TECH", "External Hard Drive", "Cloud Storage (iCloud/Drive)"),
                new WordPair("TECH", "Graphics Card (GPU)", "Processor (CPU)"),
                new WordPair("TECH", "YouTube Premium", "Spotify"),
                new WordPair("TECH", "Netflix", "Amazon Prime Video"),
                new WordPair("TECH", "Cursor AI", "VS Code"),
                new WordPair("TECH", "Claude AI", "ChatGPT"),
                new WordPair("TECH", "Apple Watch", "Fitbit Fitness Tracker"),
                new WordPair("TECH", "Twitter (X)", "Threads"),
                new WordPair("TECH", "TikTok", "YouTube Shorts"),
                new WordPair("TECH", "Mozilla Firefox", "Google Chrome"),
                new WordPair("TECH", "Ubuntu Linux", "Windows 11"),
                new WordPair("TECH", "C++", "Rust"),
                new WordPair("TECH", "React", "Vue.js"),
                new WordPair("TECH", "Bluetooth Pairing", "Apple AirDrop"),
                new WordPair("TECH", "Dual Monitors", "Ultrawide Curved Monitor"),
                new WordPair("TECH", "Motorized Standing Desk", "Ergonomic Mesh Chair"),
                new WordPair("TECH", "Wireless Gaming Mouse", "Precision Trackpad"),
                new WordPair("TECH", "Kindle E-Reader", "Physical Paper Book"),
                new WordPair("TECH", "Portable Power Bank", "Fast GaN Wall Charger"),
                new WordPair("TECH", "Nintendo Switch", "Steam Deck"),
                new WordPair("TECH", "Google Maps", "Apple Maps"),
                new WordPair("TECH", "Zoom Call", "Google Meet"),
                new WordPair("TECH", "Discord Server", "Slack Workspace"),
                new WordPair("TECH", "Reddit", "Quora"),
                new WordPair("TECH", "Wi-Fi Router", "Ethernet Cable"),
                new WordPair("TECH", "Truecaller", "Native Contacts App"),
                new WordPair("TECH", "Google Photos", "Apple Photos"),
                new WordPair("TECH", "Face ID Recognition", "In-Display Fingerprint"),
                new WordPair("TECH", "OLED Display", "AMOLED Display"),
                new WordPair("TECH", "Aerial Drone Camera", "GoPro Action Camera"),
                new WordPair("TECH", "Virtual Reality (VR)", "Augmented Reality (AR)"),
                new WordPair("TECH", "Tesla Autopilot", "Manual Driving"),
                new WordPair("TECH", "4K Smart TV", "Home Theatre Projector"),
                new WordPair("TECH", "Apple Siri", "Amazon Alexa"),
                new WordPair("TECH", "Smart RGB Bulb", "Minimalist Desk Lamp"),
                new WordPair("TECH", "Wired Earphones", "Wireless TWS Earbuds"),
                new WordPair("TECH", "1Password Manager", "Sticky Notes Password"),
                new WordPair("TECH", "Incognito Private Tab", "VPN Tunnel"),
                new WordPair("TECH", "Notion Workspace", "Obsidian Markdown Notes"),
                new WordPair("TECH", "Spotify Wrapped", "Apple Music Replay"),
                new WordPair("TECH", "Smart Video Doorbell", "Traditional Peephole"),
                new WordPair("TECH", "Apple AirTags", "Tile Bluetooth Tracker"),
                new WordPair("TECH", "4K Ultra HD", "1080p Full HD"),
                new WordPair("TECH", "Terminal CLI", "Graphical User Interface (GUI)")
        ));
    }

    // 3. SPORTS & ATHLETES (60 pairs)
    private List<WordPair> initSportsPacks() {
        return new ArrayList<>(List.of(
                new WordPair("SPORTS", "Cricket", "Football (Soccer)"),
                new WordPair("SPORTS", "Virat Kohli", "Rohit Sharma"),
                new WordPair("SPORTS", "MS Dhoni", "Sachin Tendulkar"),
                new WordPair("SPORTS", "Lionel Messi", "Cristiano Ronaldo"),
                new WordPair("SPORTS", "Lawn Tennis", "Badminton"),
                new WordPair("SPORTS", "Chess", "Carrom Board"),
                new WordPair("SPORTS", "Gym Weightlifting", "Outdoor Running"),
                new WordPair("SPORTS", "IPL T20", "Cricket World Cup"),
                new WordPair("SPORTS", "Swimming", "Bicycle Cycling"),
                new WordPair("SPORTS", "Boxing", "Mixed Martial Arts (MMA)"),
                new WordPair("SPORTS", "Basketball", "Volleyball"),
                new WordPair("SPORTS", "Fast Bowler", "Spin Bowler"),
                new WordPair("SPORTS", "Penalty Shootout", "Direct Free Kick"),
                new WordPair("SPORTS", "Formula 1 Racing", "MotoGP"),
                new WordPair("SPORTS", "Olympic Gold Medal", "World Cup Trophy"),
                new WordPair("SPORTS", "Full Marathon", "100m Sprint"),
                new WordPair("SPORTS", "Table Tennis (Ping Pong)", "Pool / Billiards"),
                new WordPair("SPORTS", "Rafael Nadal", "Roger Federer"),
                new WordPair("SPORTS", "Novak Djokovic", "Carlos Alcaraz"),
                new WordPair("SPORTS", "LeBron James", "Michael Jordan"),
                new WordPair("SPORTS", "Real Madrid", "FC Barcelona (El Clasico)"),
                new WordPair("SPORTS", "Manchester United", "Manchester City"),
                new WordPair("SPORTS", "Chennai Super Kings (CSK)", "Mumbai Indians (MI)"),
                new WordPair("SPORTS", "Royal Challengers Bengaluru (RCB)", "Kolkata Knight Riders (KKR)"),
                new WordPair("SPORTS", "Jasprit Bumrah", "Mitchell Starc"),
                new WordPair("SPORTS", "Hardik Pandya", "Ben Stokes"),
                new WordPair("SPORTS", "Pro Kabaddi", "Kho Kho"),
                new WordPair("SPORTS", "Snooker", "8-Ball Pool"),
                new WordPair("SPORTS", "Archery", "Rifle Shooting"),
                new WordPair("SPORTS", "Skateboarding", "Roller Skating"),
                new WordPair("SPORTS", "Outdoor Rock Climbing", "Indoor Bouldering"),
                new WordPair("SPORTS", "Scuba Diving", "Shallow Snorkeling"),
                new WordPair("SPORTS", "Ocean Surfing", "Jet Skiing"),
                new WordPair("SPORTS", "WWE Wrestling", "UFC Fighting"),
                new WordPair("SPORTS", "Golf", "Horse Polo"),
                new WordPair("SPORTS", "5-Day Test Cricket", "20-Over T20"),
                new WordPair("SPORTS", "Red Card Expulsion", "Yellow Card Warning"),
                new WordPair("SPORTS", "Bowling Hat-trick", "Batting Century"),
                new WordPair("SPORTS", "Goalkeeper", "Center Forward Striker"),
                new WordPair("SPORTS", "Offside Trap", "Corner Kick"),
                new WordPair("SPORTS", "Super Over", "Golden Goal"),
                new WordPair("SPORTS", "High-Intensity CrossFit", "Calming Yoga"),
                new WordPair("SPORTS", "Running Treadmill", "Park Jogging"),
                new WordPair("SPORTS", "Heavy Dumbbells", "Kettlebell Swings"),
                new WordPair("SPORTS", "Push-ups", "Pull-ups"),
                new WordPair("SPORTS", "EA Sports FC (FIFA)", "eFootball (PES)"),
                new WordPair("SPORTS", "On-field Cricket Umpire", "Third Umpire DRS"),
                new WordPair("SPORTS", "Sixer (6 Runs)", "Boundary Four (4 Runs)"),
                new WordPair("SPORTS", "Helicopter Shot", "Classic Cover Drive"),
                new WordPair("SPORTS", "Toe-crushing Yorker", "Rising Bouncer"),
                new WordPair("SPORTS", "Leg-spin Googly", "Off-spin Doosra"),
                new WordPair("SPORTS", "Lewis Hamilton", "Max Verstappen"),
                new WordPair("SPORTS", "Usain Bolt", "Michael Phelps"),
                new WordPair("SPORTS", "Serena Williams", "Maria Sharapova"),
                new WordPair("SPORTS", "Neeraj Chopra", "Arshad Nadeem"),
                new WordPair("SPORTS", "Sunil Chhetri", "Bhaichung Bhutia"),
                new WordPair("SPORTS", "Dodgeball", "Handball"),
                new WordPair("SPORTS", "Bowling Alley Strike", "Bowling Spare"),
                new WordPair("SPORTS", "Tour de France", "Giro d'Italia"),
                new WordPair("SPORTS", "Street Gali Cricket", "Stadium Floodlit Match")
        ));
    }

    // 4. CAMPUS & STUDENT LIFE (55 pairs)
    private List<WordPair> initCampusPacks() {
        return new ArrayList<>(List.of(
                new WordPair("CAMPUS", "Hostel Room", "Day Scholar Home"),
                new WordPair("CAMPUS", "College Canteen", "Hostel Mess Food"),
                new WordPair("CAMPUS", "Mid-Term Exam", "Final Semester Exam"),
                new WordPair("CAMPUS", "Backlog Arrear Exam", "Campus Placement Offer"),
                new WordPair("CAMPUS", "Night Before Exam Cramming", "Early Morning Revision"),
                new WordPair("CAMPUS", "Proxy Attendance", "Strict Biometric Scanner"),
                new WordPair("CAMPUS", "Group Project", "Solo Assignment"),
                new WordPair("CAMPUS", "Tech Fest Hackathon", "Cultural Fest DJ Night"),
                new WordPair("CAMPUS", "First Bench Front Row", "Last Bench Crew"),
                new WordPair("CAMPUS", "College Library", "Canteen Adda"),
                new WordPair("CAMPUS", "Summer Internship", "2-Month Semester Vacation"),
                new WordPair("CAMPUS", "Strict HOD Professor", "Friendly College Senior"),
                new WordPair("CAMPUS", "Viva Voce Oral Exam", "Written Theory Paper"),
                new WordPair("CAMPUS", "Mass Class Bunk", "100% Full Attendance Certificate"),
                new WordPair("CAMPUS", "College ID Card", "Exam Hall Ticket"),
                new WordPair("CAMPUS", "College Bus Ride", "Shared Auto / Bike Ride"),
                new WordPair("CAMPUS", "Slide Presentation", "Engineering Lab Practical"),
                new WordPair("CAMPUS", "8:00 AM Morning Lecture", "2:00 PM Afternoon Practical"),
                new WordPair("CAMPUS", "Secret Cheating Chit", "Pure Guesswork"),
                new WordPair("CAMPUS", "Printed Xerox Notes", "PDF Handouts on Phone"),
                new WordPair("CAMPUS", "College Campus Crush", "Study Partner"),
                new WordPair("CAMPUS", "Emotional College Farewell", "Energetic Freshers Party"),
                new WordPair("CAMPUS", "High 9.0 CGPA", "Campus Cult Fest Star"),
                new WordPair("CAMPUS", "Placement Aptitude Test", "Final HR Interview"),
                new WordPair("CAMPUS", "Fest Organizing Committee", "Casual Audience Cheerer"),
                new WordPair("CAMPUS", "Unofficial WhatsApp Class Group", "Official College Email"),
                new WordPair("CAMPUS", "Canteen Samosa Pav", "Midnight Maggi Point"),
                new WordPair("CAMPUS", "Open Book Examination", "Surprise Pop Quiz"),
                new WordPair("CAMPUS", "GitHub Copy-Paste", "Hand-Written Lab Record"),
                new WordPair("CAMPUS", "White Lab Coat", "Oversized College Hoodie"),
                new WordPair("CAMPUS", "Campus High-speed Wi-Fi", "Mobile Hotspot"),
                new WordPair("CAMPUS", "Professor's Boring PPT", "YouTube 1-Hour One-Shot Lecture"),
                new WordPair("CAMPUS", "Late Night Chai Tapri", "Midnight Kettle Maggi"),
                new WordPair("CAMPUS", "Night Out Gate Pass", "Hostel Warden Interrogation"),
                new WordPair("CAMPUS", "Roommate with AC", "Roommate who snores loudly"),
                new WordPair("CAMPUS", "Campus Corporate Placement", "Higher Studies Masters / GRE"),
                new WordPair("CAMPUS", "Mechanical Engineering", "Computer Science"),
                new WordPair("CAMPUS", "Class Representative (CR)", "Silent Backbencher"),
                new WordPair("CAMPUS", "Question Paper Leak Rumors", "Strict External Flying Squad"),
                new WordPair("CAMPUS", "College Cafeteria Cappuccino", "Rs. 10 Vending Machine Cup"),
                new WordPair("CAMPUS", "Main Campus Auditorium", "Outdoor Sports Ground"),
                new WordPair("CAMPUS", "Final Year Capstone Project", "2nd Year Mini Project"),
                new WordPair("CAMPUS", "Physical Notice Board", "WhatsApp Class Notification"),
                new WordPair("CAMPUS", "Semester Exam Break", "1-Day Prep Leave"),
                new WordPair("CAMPUS", "Campus Cafeteria Gossip", "Library Silent Study"),
                new WordPair("CAMPUS", "Engineering Graphics Drawing", "Python Coding Lab"),
                new WordPair("CAMPUS", "College ID Lanyard", "Keyring"),
                new WordPair("CAMPUS", "Submitting at 11:59 PM", "Submitting 3 Days Early"),
                new WordPair("CAMPUS", "College Reunion", "Convocation Degree Day"),
                new WordPair("CAMPUS", "Hostel Warden", "Campus Security Guard"),
                new WordPair("CAMPUS", "Technical Paper Presentation", "Poster Presentation"),
                new WordPair("CAMPUS", "College Canteen Chai", "Starbucks Latte"),
                new WordPair("CAMPUS", "First Day of College", "Last Day of College"),
                new WordPair("CAMPUS", "Class Topper", "Class Clown"),
                new WordPair("CAMPUS", "Campus Placement Package", "Startup Dream")
        ));
    }

    // 5. TRAVEL & DESTINATIONS (55 pairs)
    private List<WordPair> initTravelPacks() {
        return new ArrayList<>(List.of(
                new WordPair("TRAVEL", "Tropical Beach Holiday", "Snowy Mountain Trekking"),
                new WordPair("TRAVEL", "Goa Beach Party", "Manali Snow Valley"),
                new WordPair("TRAVEL", "Hyderabad City", "Bengaluru Garden City"),
                new WordPair("TRAVEL", "2-Hour Flight Journey", "Overnight Sleeper Train"),
                new WordPair("TRAVEL", "Solo Backpacking Adventure", "Crazy Friends Road Trip"),
                new WordPair("TRAVEL", "Luxury 5-Star Hotel Resort", "Campfire Tent Camping"),
                new WordPair("TRAVEL", "Maldives Overwater Villa", "Dubai Skyscraper Luxury"),
                new WordPair("TRAVEL", "Fast Metro Train", "Bumpy Auto Rickshaw"),
                new WordPair("TRAVEL", "Mountain Sunrise Viewpoint", "Golden Sunset Beach"),
                new WordPair("TRAVEL", "International Passport Visa", "Tatkal Train Ticket"),
                new WordPair("TRAVEL", "Theme Park Rollercoaster", "Ancient Heritage Fort"),
                new WordPair("TRAVEL", "Smooth National Highway", "Curving Hill Ghat Road"),
                new WordPair("TRAVEL", "Paris Romantic Eiffel", "Rome Colosseum Ancient"),
                new WordPair("TRAVEL", "London Big Ben", "New York Times Square"),
                new WordPair("TRAVEL", "Tokyo Neon Streets", "Seoul K-Pop Culture"),
                new WordPair("TRAVEL", "Swiss Alps Switzerland", "New Zealand Fjords"),
                new WordPair("TRAVEL", "Kashmir Valley", "Ladakh Bike Trip"),
                new WordPair("TRAVEL", "Ooty Nilgiri Mountains", "Kodaikanal Lake"),
                new WordPair("TRAVEL", "Jaipur Pink City", "Udaipur Lake City"),
                new WordPair("TRAVEL", "Agra Taj Mahal", "Old Delhi Red Fort"),
                new WordPair("TRAVEL", "Airplane Window Seat", "Airplane Aisle Seat"),
                new WordPair("TRAVEL", "Rolling Trolley Suitcase", "Rugged Rucksack Backpack"),
                new WordPair("TRAVEL", "Cozy Airbnb Apartment", "All-Inclusive Boutique Resort"),
                new WordPair("TRAVEL", "Google Translate App", "Local Native City Guide"),
                new WordPair("TRAVEL", "Ocean Luxury Cruise Ship", "Speedboat Island Hopping"),
                new WordPair("TRAVEL", "Forest Hiking Trail", "Scenic Mountain Ropeway Cable Car"),
                new WordPair("TRAVEL", "Bustling Street Food Stall", "Candlelit Fine Dining"),
                new WordPair("TRAVEL", "Heavy Winter Snowfall", "Sunny Tropical Summer"),
                new WordPair("TRAVEL", "Desert Dune Bashing", "Scuba Diving Coral Reef"),
                new WordPair("TRAVEL", "Early Morning 5 AM Flight", "Overnight Sleeper Bus"),
                new WordPair("TRAVEL", "Highway Toll Plaza", "Fastag Electronic Sensor"),
                new WordPair("TRAVEL", "Local Handcrafted Souvenirs", "Smartphone Camera Photos"),
                new WordPair("TRAVEL", "Taj Mahal Agra", "Qutub Minar Delhi"),
                new WordPair("TRAVEL", "Golden Temple Amritsar", "Tirupati Balaji Temple"),
                new WordPair("TRAVEL", "Munnar Misty Tea Gardens", "Coorg Green Coffee Plantations"),
                new WordPair("TRAVEL", "French Quarter Pondicherry", "Chill Beach Gokarna"),
                new WordPair("TRAVEL", "Mumbai Marine Drive Promenade", "Kolkata Howrah Bridge"),
                new WordPair("TRAVEL", "Varanasi Ganga Aarti Ghats", "Rishikesh River Rafting"),
                new WordPair("TRAVEL", "Singapore Marina Bay Sands", "Bangkok Floating Night Market"),
                new WordPair("TRAVEL", "Desert Oasis", "Dense Amazon Rainforest"),
                new WordPair("TRAVEL", "Night Jungle Safari", "Daytime Wildlife Sanctuary"),
                new WordPair("TRAVEL", "Wavepool Waterpark", "Natural Cascading Waterfall"),
                new WordPair("TRAVEL", "Railway Train Pantry Meals", "Platform Hot Samosa Vendor"),
                new WordPair("TRAVEL", "High Mountain Pass", "Deep Valley Canyon"),
                new WordPair("TRAVEL", "Carrying Hardcopy Maps", "Google Maps Navigation"),
                new WordPair("TRAVEL", "Hotel Breakfast Buffet", "Local Morning Tiffin Stall"),
                new WordPair("TRAVEL", "Iceland Northern Lights", "Hawaii Volcanic Islands"),
                new WordPair("TRAVEL", "Venice Canal Gondola", "Amsterdam Canal Cruise"),
                new WordPair("TRAVEL", "Grand Canyon USA", "Niagara Falls"),
                new WordPair("TRAVEL", "Bali Island Temples", "Phuket Island Beaches"),
                new WordPair("TRAVEL", "Travelling Light (1 Bag)", "Overpacking 3 Heavy Bags"),
                new WordPair("TRAVEL", "Hitchhiking Adventure", "Chauffeur Driven Taxi"),
                new WordPair("TRAVEL", "Historic Museum Tour", "Wild Amusement Park"),
                new WordPair("TRAVEL", "Desert Camel Safari", "Elephant Sanctuary Walk"),
                new WordPair("TRAVEL", "Staycation in Own City", "International Expedition")
        ));
    }

    // 6. LIFESTYLE & DAILY HABITS (55 pairs)
    private List<WordPair> initLifestylePacks() {
        return new ArrayList<>(List.of(
                new WordPair("LIFESTYLE", "Early Morning 6 AM Person", "Late 3 AM Night Owl"),
                new WordPair("LIFESTYLE", "Work From Home (WFH) in Pajamas", "Dressed Up Office Cubicle"),
                new WordPair("LIFESTYLE", "Instant Online Shopping", "Bargaining at Local Street Bazaar"),
                new WordPair("LIFESTYLE", "Credit Card Cashback", "Cash / Instant UPI QR Scan"),
                new WordPair("LIFESTYLE", "Reading Paperback Book", "Binge-Watching 8-Episode Series"),
                new WordPair("LIFESTYLE", "18°C Air Conditioner (AC)", "Open Window Cool Breeze"),
                new WordPair("LIFESTYLE", "Ringing Alarm Clock", "10-Minute Repeated Snooze"),
                new WordPair("LIFESTYLE", "Folding Pocket Umbrella", "Full Body Raincoat"),
                new WordPair("LIFESTYLE", "Quick Fast Food Takeout", "Warm Home-Cooked Meal"),
                new WordPair("LIFESTYLE", "Fast Elevator Lift", "Burning Calories Staircase"),
                new WordPair("LIFESTYLE", "Energetic Morning Jogging", "Relaxing Evening Stroll"),
                new WordPair("LIFESTYLE", "Scorching Summer Heat", "Freezing Winter Chill"),
                new WordPair("LIFESTYLE", "Steaming Hot Water Shower", "Refreshing Cold Splash"),
                new WordPair("LIFESTYLE", "20-Minute Power Nap", "Strong Double Espresso Shot"),
                new WordPair("LIFESTYLE", "Handwritten Personal Journal", "Quick Audio Voice Notes"),
                new WordPair("LIFESTYLE", "Giant Supermarket Mart", "Friendly Kirana Store Down the Street"),
                new WordPair("LIFESTYLE", "Cooking From Recipe at Home", "Ordering Delivery on Swiggy"),
                new WordPair("LIFESTYLE", "Hardcore Gym Weight Training", "Peaceful Morning Yoga"),
                new WordPair("LIFESTYLE", "Perfectly Organized Clean Desk", "Creative Clutter & Coffee Mugs"),
                new WordPair("LIFESTYLE", "Watching Movie in Silence Alone", "Theater Screaming with Friends"),
                new WordPair("LIFESTYLE", "Voice Calling on Phone", "Texting via Memes & Emojis"),
                new WordPair("LIFESTYLE", "Casual Graphic Tee & Jeans", "Formal Tailored Suit & Tie"),
                new WordPair("LIFESTYLE", "Branded White Sneakers", "Super Comfortable Crocs / Slides"),
                new WordPair("LIFESTYLE", "Classic Wristwatch", "Checking Smartphone Lock Screen"),
                new WordPair("LIFESTYLE", "Stylish UV Sunglasses", "Clear Prescription Spectacles"),
                new WordPair("LIFESTYLE", "Sonic Electric Toothbrush", "Classic Manual Toothbrush"),
                new WordPair("LIFESTYLE", "Hair Conditioning Shampoo", "Grandma's Herbal Hair Oil"),
                new WordPair("LIFESTYLE", "Luxury French Cologne", "Everyday Body Deodorant Spray"),
                new WordPair("LIFESTYLE", "Automatic Washing Machine", "Bucket Hand Laundry"),
                new WordPair("LIFESTYLE", "Instant Granule Coffee", "South Indian Filter Decoction"),
                new WordPair("LIFESTYLE", "Hot Herbal Green Tea", "Sweet Spiced Kadak Chai"),
                new WordPair("LIFESTYLE", "Reading Tech News on Phone", "Morning Physical Newspaper"),
                new WordPair("LIFESTYLE", "Loud Weekend House Party", "Quiet Weekend Gaming Night"),
                new WordPair("LIFESTYLE", "Watering Indoor Bonsai Plant", "Feeding Playful Pet Dog"),
                new WordPair("LIFESTYLE", "Detailed Monthly Budget Excel", "If My Card Swipes, I Have Money"),
                new WordPair("LIFESTYLE", "Crisp Ironed Clothes", "Shaking Wrinkles Out of T-shirt"),
                new WordPair("LIFESTYLE", "Walking 500 Meters", "Taking Scooter for 200 Meters"),
                new WordPair("LIFESTYLE", "Midnight Kitchen Raid Snack", "16-Hour Intermittent Fasting"),
                new WordPair("LIFESTYLE", "Drinking 3 Liters of Water Daily", "Forgetting Water All Day"),
                new WordPair("LIFESTYLE", "Informative Deep-Dive Podcast", "High-BPM Workout Playlist"),
                new WordPair("LIFESTYLE", "Endless Scrolling of Reels & TikToks", "Reading In-Depth Articles"),
                new WordPair("LIFESTYLE", "Packing 3 Days in Advance", "Packing 15 Minutes Before Leaving"),
                new WordPair("LIFESTYLE", "75 Open Tabs in Browser", "Single Tidy Tab Setup"),
                new WordPair("LIFESTYLE", "Blinding 100% Screen Brightness", "10% Dim Battery-Saver Mode"),
                new WordPair("LIFESTYLE", "Unread 5,000 Notification Badges", "Inbox Zero Perfection"),
                new WordPair("LIFESTYLE", "Drinking Black Coffee", "Drinking Sweet Caramel Frappuccino"),
                new WordPair("LIFESTYLE", "Living in Bustling Metro City", "Living in Peaceful Countryside"),
                new WordPair("LIFESTYLE", "Vegetarian Diet", "Meat Barbecue Diet"),
                new WordPair("LIFESTYLE", "Saving Money in Fixed Deposit", "Trading in Stock Market"),
                new WordPair("LIFESTYLE", "Listening to Music on Loudspeaker", "Immersive Noise-Cancelling"),
                new WordPair("LIFESTYLE", "Taking Notes by Hand", "Typing on iPad Stylus"),
                new WordPair("LIFESTYLE", "Wearing Perfume Everyday", "Wearing Perfume Only on Special Days"),
                new WordPair("LIFESTYLE", "Waking Up Without Alarm", "15 Successive Alarms"),
                new WordPair("LIFESTYLE", "Leaving 1% Phone Battery", "Recharging at 50%"),
                new WordPair("LIFESTYLE", "Eating Out Every Weekend", "Sunday Family Lunch")
        ));
    }

    // 7. ANIMALS & NATURE (55 pairs)
    private List<WordPair> initAnimalsPacks() {
        return new ArrayList<>(List.of(
                new WordPair("ANIMALS", "Loyal Pet Dog", "Independent Pet Cat"),
                new WordPair("ANIMALS", "Roaring Savannah Lion", "Stealthy Royal Bengal Tiger"),
                new WordPair("ANIMALS", "Playful Dolphin", "Apex Great White Shark"),
                new WordPair("ANIMALS", "Galloping Horse", "Desert Survivor Camel"),
                new WordPair("ANIMALS", "Majestic Eagle", "High-Speed Hunting Falcon"),
                new WordPair("ANIMALS", "Gentle Giant Elephant", "Armored African Rhinoceros"),
                new WordPair("ANIMALS", "Coordinated Wolf Pack", "Cunning Red Fox"),
                new WordPair("ANIMALS", "Colorful Dancing Peacock", "Mimicking Talking Parrot"),
                new WordPair("ANIMALS", "Bamboo-Eating Giant Panda", "Grizzly Brown Bear"),
                new WordPair("ANIMALS", "Venomous King Cobra", "Massive Constrictor Python"),
                new WordPair("ANIMALS", "Freshwater Crocodile", "Saltwater Alligator"),
                new WordPair("ANIMALS", "Cheetah (Pure Speed)", "Leopard (Tree Stealth)"),
                new WordPair("ANIMALS", "Friendly Golden Retriever", "Protective German Shepherd"),
                new WordPair("ANIMALS", "Fluffy Persian Cat", "Agile Stray Kitten"),
                new WordPair("ANIMALS", "Enormous Blue Whale", "Highly Intelligent Killer Whale (Orca)"),
                new WordPair("ANIMALS", "Tool-Using Chimpanzee", "Mountain Silverback Gorilla"),
                new WordPair("ANIMALS", "Antarctic Emperor Penguin", "Arctic Polar Bear"),
                new WordPair("ANIMALS", "Australian Kangaroo", "Tree-Dwelling Koala Bear"),
                new WordPair("ANIMALS", "Nocturnal Barn Owl", "Diurnal Red-Tailed Hawk"),
                new WordPair("ANIMALS", "Fluttering Monarch Butterfly", "Hardworking Honeybee"),
                new WordPair("ANIMALS", "Color-Shifting Chameleon", "Wall-Climbing Gecko Lizard"),
                new WordPair("ANIMALS", "Slow Land Tortoise", "Ocean-Migrating Sea Turtle"),
                new WordPair("ANIMALS", "Shadow Black Panther", "Snow Mountain Leopard"),
                new WordPair("ANIMALS", "Territorial Grey Wolf", "Solitary Coyote"),
                new WordPair("ANIMALS", "Heavyweight Hippopotamus", "Horned White Rhino"),
                new WordPair("ANIMALS", "Striped African Zebra", "Long-Necked Giraffe"),
                new WordPair("ANIMALS", "Pink Lagoon Flamingo", "Graceful White Swan"),
                new WordPair("ANIMALS", "Rapid Hummingbird", "Trunk-Drilling Woodpecker"),
                new WordPair("ANIMALS", "Desert Scorpion", "Hairy Tarantula Spider"),
                new WordPair("ANIMALS", "Translucent Sea Jellyfish", "Five-Armed Starfish"),
                new WordPair("ANIMALS", "Tropical Coral Reef", "Mysterious Deep Sea Mariana Trench"),
                new WordPair("ANIMALS", "Raging Forest Wildfire", "Fast-Moving Flash Flood"),
                new WordPair("ANIMALS", "Volcanic Magma Eruption", "Tectonic Earthquake Tremor"),
                new WordPair("ANIMALS", "Summer Thunderstorm Lightning", "Freezing Blizzard Snowstorm"),
                new WordPair("ANIMALS", "Golden Sahara Sand Dunes", "Blue Mountain Glacier"),
                new WordPair("ANIMALS", "Ancient Oak Tree", "Sprawling Sacred Banyan Tree"),
                new WordPair("ANIMALS", "Fragrant Red Rose Garden", "Bright Yellow Sunflower Field"),
                new WordPair("ANIMALS", "Desert Prickly Cactus", "Fast-Growing Green Bamboo"),
                new WordPair("ANIMALS", "Glowing Night Firefly", "Fast Aerial Dragonfly"),
                new WordPair("ANIMALS", "Intelligent Black Crow", "City Park Pigeon"),
                new WordPair("ANIMALS", "Coastal Seagull", "Big-Pouched White Pelican"),
                new WordPair("ANIMALS", "Furry Golden Hamster", "Chirping Guinea Pig"),
                new WordPair("ANIMALS", "Fast-Hopping Wild Rabbit", "Acorn-Gathering Tree Squirrel"),
                new WordPair("ANIMALS", "Woolly Domestic Sheep", "Mountain Cliff Goat"),
                new WordPair("ANIMALS", "Milk Cow", "Water Buffalo"),
                new WordPair("ANIMALS", "Sea Otter", "River Beaver"),
                new WordPair("ANIMALS", "Armadillo", "Porcupine"),
                new WordPair("ANIMALS", "Piranha", "Electric Eel"),
                new WordPair("ANIMALS", "Platypus", "Echidna"),
                new WordPair("ANIMALS", "Kingfisher", "Sea Pelican"),
                new WordPair("ANIMALS", "Praying Mantis", "Grasshopper"),
                new WordPair("ANIMALS", "Bald Eagle", "Peregrine Falcon"),
                new WordPair("ANIMALS", "Great Barrier Reef", "Amazon Basin Rainforest"),
                new WordPair("ANIMALS", "Aurora Borealis", "Solar Eclipse"),
                new WordPair("ANIMALS", "Giant Redwood Sequoia", "Bonsai Miniature Tree")
        ));
    }

    // 8. CAREERS & WORKPLACE (55 pairs)
    private List<WordPair> initCareersPacks() {
        return new ArrayList<>(List.of(
                new WordPair("CAREERS", "Fast-Paced High-Growth Startup", "Stable Corporate MNC"),
                new WordPair("CAREERS", "Software Engineer (Coder)", "Product Manager (Vision & Roadmap)"),
                new WordPair("CAREERS", "Freelance Independent Consultant", "Full-Time 9-to-5 Salaried Job"),
                new WordPair("CAREERS", "Monthly Salary Credit Day", "Friday Weekend Celebration Eve"),
                new WordPair("CAREERS", "Pantry Coffee Machine Chat", "Quick 30-Minute Lunch Break"),
                new WordPair("CAREERS", "Corporate Managing CEO", "Passionate Startup Founder"),
                new WordPair("CAREERS", "Virtual Zoom Meeting Call", "In-Person Boardroom Pitch"),
                new WordPair("CAREERS", "Fast-Track Job Promotion", "Big Annual Performance Bonus"),
                new WordPair("CAREERS", "Clean 1-Page Resume CV", "Impressive LinkedIn Profile"),
                new WordPair("CAREERS", "Writing Elegant Bug-Free Code", "Hunting Down Mysterious Bugs"),
                new WordPair("CAREERS", "Modern React Frontend Developer", "Scalable Backend Architect"),
                new WordPair("CAREERS", "Predictive Data Scientist", "Business Intelligence Data Analyst"),
                new WordPair("CAREERS", "User Experience (UX) Researcher", "Visual Graphic Designer"),
                new WordPair("CAREERS", "Cloud DevOps SRE", "On-Premise System Administrator"),
                new WordPair("CAREERS", "Rigorous QA Manual Tester", "Fast Automated Test Suite"),
                new WordPair("CAREERS", "Engineering Team Lead", "Specialized Individual Contributor (IC)"),
                new WordPair("CAREERS", "Rewriting in Modern Tech Stack", "Maintaining 10-Year Legacy Code"),
                new WordPair("CAREERS", "Two-Week Agile Scrum Sprint", "Traditional Waterfall Timeline"),
                new WordPair("CAREERS", "Urgent Jira Priority Ticket", "Can We Jump on a Quick Call? Slack"),
                new WordPair("CAREERS", "15-Minute Daily Standup", "1-Hour Status Update Meeting"),
                new WordPair("CAREERS", "Mandatory 5 Days in Office", "100% Work from Anywhere in the World"),
                new WordPair("CAREERS", "Stock Options (ESOPs) with 4-Year Vesting", "Hard Cash In Hand"),
                new WordPair("CAREERS", "3-Month Notice Period", "Immediate Joining Next Monday"),
                new WordPair("CAREERS", "High-Stakes Client Presentation", "Internal Friday Demo Session"),
                new WordPair("CAREERS", "Messy Whiteboard Brainstorm", "Polished 20-Slide Pitch Deck"),
                new WordPair("CAREERS", "Dedicated Family Doctor", "High-Precision Specialist Surgeon"),
                new WordPair("CAREERS", "Civil Structural Architect", "Creative Interior Home Designer"),
                new WordPair("CAREERS", "High-Billing Corporate Lawyer", "Passionate Criminal Defense Attorney"),
                new WordPair("CAREERS", "Wall Street Investment Banker", "High-Risk Day Stock Trader"),
                new WordPair("CAREERS", "Chartered Accountant (CA)", "Wealth Management Financial Advisor"),
                new WordPair("CAREERS", "Boeing Airline Commercial Pilot", "High-Stress Air Traffic Controller"),
                new WordPair("CAREERS", "Inspiring High School Teacher", "Research University Professor"),
                new WordPair("CAREERS", "Investigative Crime Journalist", "Prime-Time TV News Anchor"),
                new WordPair("CAREERS", "Executive Michelin Star Chef", "Harsh Fine-Dining Food Critic"),
                new WordPair("CAREERS", "Haute Couture Fashion Designer", "International Runway Fashion Model"),
                new WordPair("CAREERS", "Visionary Film Director", "Master of Light Cinematographer (DoP)"),
                new WordPair("CAREERS", "Chart-Topping Lead Vocalist", "Wizard Sound Mix Audio Engineer"),
                new WordPair("CAREERS", "High-ROI Performance Marketer", "Enterprise B2B Sales Closer"),
                new WordPair("CAREERS", "Tier-1 Customer Happiness Support", "Level-3 Deep Tech Support"),
                new WordPair("CAREERS", "High-Stress Graveyard Night Shift", "Regular 9 AM Morning Routine"),
                new WordPair("CAREERS", "Annual Performance Appraisal", "Friendly HR Exit Interview"),
                new WordPair("CAREERS", "Loud Collaborative Open Office", "Quiet Soundproof Private Cabin"),
                new WordPair("CAREERS", "Dual 4K Ergonomic Monitor Rig", "Minimalist 13-Inch Laptop Screen"),
                new WordPair("CAREERS", "Unlimited Paid Time Off (PTO)", "Guaranteed Cash Encashment"),
                new WordPair("CAREERS", "Corporate Offsite Retreat", "Direct Cash Diwali/Year-End Bonus"),
                new WordPair("CAREERS", "Full-Stack Generalist", "Deep Domain Specialist"),
                new WordPair("CAREERS", "Startup Equity", "Guaranteed Pension"),
                new WordPair("CAREERS", "Hard Skills (Coding/Math)", "Soft Skills (Negotiation/Leadership)"),
                new WordPair("CAREERS", "Early Stage Seed Round", "Series C Expansion"),
                new WordPair("CAREERS", "On-Call Incident PagerDuty Alert", "Quiet Weekend Sleep"),
                new WordPair("CAREERS", "Client Freelance Contract", "Government Job Security"),
                new WordPair("CAREERS", "Silicon Valley Culture", "Wall Street Financial Culture"),
                new WordPair("CAREERS", "Working 80 Hours a Week for Ambition", "Strict 40-Hour Work-Life Balance"),
                new WordPair("CAREERS", "Working for a Unicorn", "Bootstrapping a Profitable Business"),
                new WordPair("CAREERS", "Code Review Pull Request Approval", "LGTM, Ship It!")
        ));
    }

    // 9. CINEMA & POP CULTURE (65 pairs)
    private List<WordPair> initMoviesPacks() {
        return new ArrayList<>(List.of(
                new WordPair("MOVIES", "Baahubali: The Beginning", "Magadheera"),
                new WordPair("MOVIES", "RRR (Rise Roar Revolt)", "K.G.F (Chapter 1 & 2)"),
                new WordPair("MOVIES", "Pushpa: The Rise", "Rangasthalam"),
                new WordPair("MOVIES", "Kalki 2898 AD", "Salaar: Part 1 – Ceasefire"),
                new WordPair("MOVIES", "Marvel Cinematic Universe", "DC Extended Universe"),
                new WordPair("MOVIES", "The Dark Knight Batman", "Man of Steel Superman"),
                new WordPair("MOVIES", "Harry Potter (Hogwarts)", "Lord of the Rings (Middle Earth)"),
                new WordPair("MOVIES", "Japanese Anime Series", "Korean K-Drama Romance"),
                new WordPair("MOVIES", "Theatre First Day First Show (FDFS)", "OTT Midnight Couch Premiere"),
                new WordPair("MOVIES", "Pokiri", "Businessman (Mahesh Babu)"),
                new WordPair("MOVIES", "Megastar Chiranjeevi", "Nandamuri Balakrishna"),
                new WordPair("MOVIES", "Power Star Pawan Kalyan", "Superstar Mahesh Babu"),
                new WordPair("MOVIES", "Rebel Star Prabhas", "Icon Star Allu Arjun"),
                new WordPair("MOVIES", "SS Rajamouli", "Sukumar"),
                new WordPair("MOVIES", "Naatu Naatu (Oscar Win)", "Oo Antava Oo Oo Antava"),
                new WordPair("MOVIES", "Kattappa (The Loyal Warrior)", "Bhallaladeva (The Ruthless King)"),
                new WordPair("MOVIES", "Shiva (Cycle Chain)", "Geethanjali (Romantic Classic)"),
                new WordPair("MOVIES", "Athadu", "Khaleja (Trivikram Classics)"),
                new WordPair("MOVIES", "Agent Sai Srinivasa Athreya", "Mathu Vadalara"),
                new WordPair("MOVIES", "DJ Tillu (Radhika DJ)", "Jathi Ratnalu (Jogipet Srikanth)"),
                new WordPair("MOVIES", "Tony Stark (Iron Man)", "Steve Rogers (Captain America)"),
                new WordPair("MOVIES", "Friendly Neighborhood Spider-Man", "Merc with a Mouth Deadpool"),
                new WordPair("MOVIES", "The Joker (Heath Ledger)", "Thanos (The Mad Titan)"),
                new WordPair("MOVIES", "Thor (God of Thunder)", "Loki (God of Mischief)"),
                new WordPair("MOVIES", "Star Wars (Jedi Galaxy)", "Star Trek (Starfleet Federation)"),
                new WordPair("MOVIES", "Christopher Nolan", "Quentin Tarantino"),
                new WordPair("MOVIES", "Inception (Dream Layers)", "Interstellar (Black Hole Wormhole)"),
                new WordPair("MOVIES", "The Dark Knight", "Avengers: Endgame"),
                new WordPair("MOVIES", "James Cameron's Titanic", "Avatar (Pandora Na'vi)"),
                new WordPair("MOVIES", "Money Heist (Bella Ciao)", "Squid Game (Red Light Green Light)"),
                new WordPair("MOVIES", "Stranger Things (The Upside Down)", "Wednesday (Addams Family)"),
                new WordPair("MOVIES", "Breaking Bad (Walter White)", "Better Call Saul (Saul Goodman)"),
                new WordPair("MOVIES", "Game of Thrones (Westeros)", "House of the Dragon (Targaryens)"),
                new WordPair("MOVIES", "Narcos (Pablo Escobar)", "Peaky Blinders (Thomas Shelby)"),
                new WordPair("MOVIES", "Death Note (Light vs L)", "Attack on Titan (Eren Yeager)"),
                new WordPair("MOVIES", "Naruto Shippuden", "One Piece (Luffy)"),
                new WordPair("MOVIES", "Demon Slayer (Kimetsu no Yaiba)", "Jujutsu Kaisen (Gojo Satoru)"),
                new WordPair("MOVIES", "Dragon Ball Z (Goku)", "Bleach (Ichigo Kurosaki)"),
                new WordPair("MOVIES", "King Khan Shah Rukh Khan", "Bhaijaan Salman Khan"),
                new WordPair("MOVIES", "Shahenshah Amitabh Bachchan", "Superstar Rajinikanth"),
                new WordPair("MOVIES", "Ulaganayagan Kamal Haasan", "Superstar Rajinikanth"),
                new WordPair("MOVIES", "Thalapathy Vijay", "Thala Ajith Kumar"),
                new WordPair("MOVIES", "Chiyaan Vikram", "Suriya Sivakumar"),
                new WordPair("MOVIES", "Young Tiger Jr NTR", "Mega Power Star Ram Charan"),
                new WordPair("MOVIES", "Samantha Ruth Prabhu", "Lady Superstar Nayanthara"),
                new WordPair("MOVIES", "Deepika Padukone", "Alia Bhatt"),
                new WordPair("MOVIES", "A.R. Rahman (Mozart of Madras)", "Anirudh Ravichander (Rockstar)"),
                new WordPair("MOVIES", "Rockstar DSP (Devi Sri Prasad)", "S. Thaman"),
                new WordPair("MOVIES", "Keerthy Suresh (Mahanati)", "Sai Pallavi (Fidaa)"),
                new WordPair("MOVIES", "Lokesh Cinematic Universe (LCU)", "Prashanth Neel Cinematic Universe"),
                new WordPair("MOVIES", "Rajinikanth's Jailer", "Thalapathy Vijay's Leo"),
                new WordPair("MOVIES", "Kamal Haasan's Vikram", "Karthi's Kaithi"),
                new WordPair("MOVIES", "Rishab Shetty's Kantara", "Tumbbad (Hastar)"),
                new WordPair("MOVIES", "Iconic Sholay (Gabbar Singh)", "Classic Deewaar"),
                new WordPair("MOVIES", "Dilwale Dulhania Le Jayenge (DDLJ)", "Kuch Kuch Hota Hai (KKHH)"),
                new WordPair("MOVIES", "3 Idiots (All Izz Well)", "Dangal (Geeta & Babita)"),
                new WordPair("MOVIES", "Munna Bhai M.B.B.S.", "Lage Raho Munna Bhai"),
                new WordPair("MOVIES", "Cinema Hall Cheese Caramel Popcorn", "Samosa in 15-Minute Interval"),
                new WordPair("MOVIES", "Front Row First Day Balcony", "Luxury Recliner Gold Class"),
                new WordPair("MOVIES", "Shutter Island", "Fight Club"),
                new WordPair("MOVIES", "The Matrix (Red Pill vs Blue Pill)", "John Wick (Continental Hotel)"),
                new WordPair("MOVIES", "Sherlock Holmes", "Hercule Poirot"),
                new WordPair("MOVIES", "Marvel's Wolverine", "Marvel's Black Panther"),
                new WordPair("MOVIES", "Pixar Animation Studios", "DreamWorks Animation"),
                new WordPair("MOVIES", "Horror Haunted House Movie", "Sci-Fi Time Travel Thriller")
        ));
    }

    public List<WordPair> addVsPairs(CustomVsRequest req) {
        String cat = (req.getCategory() != null && !req.getCategory().isBlank())
                ? req.getCategory().trim().toUpperCase().replaceAll("\\s+", "_")
                : "CUSTOM_VS";
        List<WordPair> newPairs = new ArrayList<>();

        // 1. Process structured pairs if provided
        if (req.getPairs() != null) {
            for (CustomVsRequest.CustomVsItem item : req.getPairs()) {
                if (item.getWordA() != null && !item.getWordA().isBlank() &&
                    item.getWordB() != null && !item.getWordB().isBlank()) {
                    newPairs.add(new WordPair(cat, item.getWordA().trim(), item.getWordB().trim()));
                }
            }
        }

        // 2. Parse raw text lines using 'vs', 'VS', 'versus', '/'
        if (req.getRawText() != null && !req.getRawText().isBlank()) {
            String[] lines = req.getRawText().split("\\r?\\n");
            for (String line : lines) {
                line = line.trim();
                if (line.isBlank()) continue;
                String[] parts = line.split("(?i)\\s+(?:vs\\.?|versus|/)\\s+");
                if (parts.length >= 2) {
                    String a = parts[0].trim();
                    String b = parts[1].trim();
                    if (!a.isEmpty() && !b.isEmpty()) {
                        newPairs.add(new WordPair(cat, a, b));
                    }
                }
            }
        }

        if (newPairs.isEmpty()) {
            throw new IllegalArgumentException("No valid 'Word A vs Word B' pairs found. Please format as: Item A vs Item B");
        }

        // Save to DB for permanent persistence
        List<CustomWordPairEntity> entities = newPairs.stream().map(p -> CustomWordPairEntity.builder()
                .category(cat)
                .wordA(p.getWordA())
                .wordB(p.getWordB())
                .createdAt(System.currentTimeMillis())
                .build()).toList();
        customWordPairRepo.saveAll(entities);

        // Update in-memory packs
        packs.computeIfAbsent(cat, k -> new ArrayList<>()).addAll(newPairs);
        if (!"CUSTOM_VS".equals(cat)) {
            packs.computeIfAbsent("CUSTOM_VS", k -> new ArrayList<>()).addAll(newPairs);
        }

        return newPairs;
    }

    public List<CustomWordPairEntity> getAllCustomVsEntities() {
        return customWordPairRepo.findAll();
    }

    public void deleteCustomVsPair(Long id) {
        customWordPairRepo.deleteById(id);
        List<CustomWordPairEntity> remaining = customWordPairRepo.findAll();
        List<WordPair> updated = remaining.stream()
                .map(e -> new WordPair(e.getCategory(), e.getWordA(), e.getWordB()))
                .toList();
        packs.put("CUSTOM_VS", new ArrayList<>(updated));
    }

    /**
     * Get an UNUSED word pair so pairs do not repeat in a room!
     * If all pairs in the category have been used, cycles over cleanly.
     */
    public WordPair getUnusedPair(String category, Set<String> excludedKeys) {
        String cat = (category != null ? category.toUpperCase().trim() : "ALL_REAL_WORLD");
        List<WordPair> candidatePool = new ArrayList<>();

        if ("ALL_REAL_WORLD".equals(cat) || "SURPRISE_MIX".equals(cat) || "ALL".equals(cat)) {
            for (Map.Entry<String, List<WordPair>> entry : packs.entrySet()) {
                if (!"CUSTOM_AI".equalsIgnoreCase(entry.getKey())) {
                    candidatePool.addAll(entry.getValue());
                }
            }
        } else {
            List<WordPair> list = packs.get(cat);
            if (list != null && !list.isEmpty()) {
                candidatePool.addAll(list);
            } else {
                List<WordPair> fallback = packs.get("FOOD");
                if (fallback != null) candidatePool.addAll(fallback);
            }
        }

        if (candidatePool.isEmpty()) {
            return new WordPair("FOOD", "Biryani", "Pulao");
        }

        // Filter out pairs that have already been played in this room
        List<WordPair> freshPool = new ArrayList<>();
        for (WordPair p : candidatePool) {
            if (excludedKeys == null || !excludedKeys.contains(p.getCanonicalKey())) {
                freshPool.add(p);
            }
        }

        // If all pairs in this pool have been played, cycle over and remove candidate keys from excludedKeys
        if (freshPool.isEmpty()) {
            freshPool = new ArrayList<>(candidatePool);
            if (excludedKeys != null) {
                for (WordPair p : candidatePool) {
                    excludedKeys.remove(p.getCanonicalKey());
                }
            }
        }

        // Return a random fresh pair from the unplayed pool
        return freshPool.get(random.nextInt(freshPool.size()));
    }

    public WordPair getRandomPair(String category) {
        return getUnusedPair(category, null);
    }

    public Map<String, Integer> getAvailablePacks() {
        Map<String, Integer> summary = new LinkedHashMap<>();
        packs.forEach((k, v) -> summary.put(k, v.size()));
        int totalRealWorld = packs.entrySet().stream()
                .filter(e -> !"CUSTOM_AI".equalsIgnoreCase(e.getKey()))
                .mapToInt(e -> e.getValue().size())
                .sum();
        summary.put("ALL_REAL_WORLD", totalRealWorld);
        return summary;
    }

    public void addCustomPairs(String category, List<WordPair> newPairs) {
        if (newPairs != null && !newPairs.isEmpty()) {
            packs.computeIfAbsent(category.toUpperCase(), k -> new ArrayList<>()).addAll(newPairs);
        }
    }
}
