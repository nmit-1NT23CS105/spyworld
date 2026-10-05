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
        // Core CineSpy Indian Cinema Packs
        List<WordPair> telugu = initTeluguMoviePacks();
        List<WordPair> tamil = initTamilMoviePacks();
        List<WordPair> hindi = initHindiMoviePacks();
        List<WordPair> malayalam = initMalayalamMoviePacks();
        List<WordPair> kannada = initKannadaMoviePacks();

        packs.put("MOVIES_TELUGU", telugu);
        packs.put("TELUGU", telugu);
        packs.put("MOVIES_TAMIL", tamil);
        packs.put("TAMIL", tamil);
        packs.put("MOVIES_HINDI", hindi);
        packs.put("HINDI", hindi);
        packs.put("MOVIES_MALAYALAM", malayalam);
        packs.put("MALAYALAM", malayalam);
        packs.put("MOVIES_KANNADA", kannada);
        packs.put("KANNADA", kannada);

        List<WordPair> allIndianCinema = new ArrayList<>();
        allIndianCinema.addAll(telugu);
        allIndianCinema.addAll(tamil);
        allIndianCinema.addAll(hindi);
        allIndianCinema.addAll(malayalam);
        allIndianCinema.addAll(kannada);
        packs.put("ALL_INDIAN_CINEMA", allIndianCinema);
        packs.put("ALL_INDIAN", allIndianCinema);
        packs.put("MOVIES", allIndianCinema);

        // Real World Packs (Food, Tech, Sports, etc.)
        packs.put("FOOD", initFoodPacks());
        packs.put("TECH", initTechPacks());
        packs.put("SPORTS", initSportsPacks());
        packs.put("CAMPUS", initCampusPacks());
        packs.put("TRAVEL", initTravelPacks());
        packs.put("LIFESTYLE", initLifestylePacks());
        packs.put("ANIMALS", initAnimalsPacks());
        packs.put("CAREERS", initCareersPacks());

        // Load or seed persistent custom VS pairs from database
        try {
            List<CustomWordPairEntity> saved = customWordPairRepo.findAll();
            if (saved.isEmpty() || saved.size() < 10) {
                List<CustomWordPairEntity> seedVs = List.of(
                        createVsEntity("Pokiri", "Businessman"),
                        createVsEntity("Ala Vaikunthapurramuloo", "Race Gurram"),
                        createVsEntity("Jersey", "Mahanati"),
                        createVsEntity("Kaithi", "Vikram"),
                        createVsEntity("Baahubali", "Magadheera"),
                        createVsEntity("RRR", "K.G.F"),
                        createVsEntity("Pushpa", "Rangasthalam"),
                        createVsEntity("Sholay", "Deewaar"),
                        createVsEntity("3 Idiots", "Dangal"),
                        createVsEntity("Drishyam", "Ratsasan"),
                        createVsEntity("Vikram Vedha", "Master"),
                        createVsEntity("Jailer", "Leo"),
                        createVsEntity("Premam", "Bangalore Days"),
                        createVsEntity("Aavesham", "Romancham"),
                        createVsEntity("Kantara", "Tumbbad"),
                        createVsEntity("DJ Tillu", "Tillu Square"),
                        createVsEntity("Athadu", "Khaleja"),
                        createVsEntity("Anniyan (Aparichit)", "Ghajini"),
                        createVsEntity("Swades", "Lagaan"),
                        createVsEntity("Lucifer", "Bheeshma Parvam")
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

    // ==========================================
    // 1. TELUGU CINEMA (Tollywood - 35 pairs)
    // ==========================================
    private List<WordPair> initTeluguMoviePacks() {
        return new ArrayList<>(List.of(
                new WordPair("MOVIES_TELUGU", "Pokiri", "Businessman"),
                new WordPair("MOVIES_TELUGU", "Ala Vaikunthapurramuloo", "Race Gurram"),
                new WordPair("MOVIES_TELUGU", "Jersey", "Mahanati"),
                new WordPair("MOVIES_TELUGU", "Baahubali: The Beginning", "Magadheera"),
                new WordPair("MOVIES_TELUGU", "Pushpa: The Rise", "Rangasthalam"),
                new WordPair("MOVIES_TELUGU", "Athadu", "Khaleja"),
                new WordPair("MOVIES_TELUGU", "DJ Tillu", "Tillu Square"),
                new WordPair("MOVIES_TELUGU", "RRR", "Eega"),
                new WordPair("MOVIES_TELUGU", "Shiva", "Satya"),
                new WordPair("MOVIES_TELUGU", "Agent Sai Srinivasa Athreya", "Mathu Vadalara"),
                new WordPair("MOVIES_TELUGU", "Geetha Govindam", "Arjun Reddy"),
                new WordPair("MOVIES_TELUGU", "Sarileru Neekevvaru", "Bharat Ane Nenu"),
                new WordPair("MOVIES_TELUGU", "Attarintiki Daredi", "Jalsa"),
                new WordPair("MOVIES_TELUGU", "Chatrapathi", "Simhadri"),
                new WordPair("MOVIES_TELUGU", "Mirchi", "Srimanthudu"),
                new WordPair("MOVIES_TELUGU", "Goodachari", "HIT: The First Case"),
                new WordPair("MOVIES_TELUGU", "Brochevarevarura", "Ee Nagaraniki Emaindi"),
                new WordPair("MOVIES_TELUGU", "C/o Kancharapalem", "Pellichoopulu"),
                new WordPair("MOVIES_TELUGU", "Hanu-Man", "Karthikeya 2"),
                new WordPair("MOVIES_TELUGU", "Salaar: Part 1 – Ceasefire", "Kalki 2898 AD"),
                new WordPair("MOVIES_TELUGU", "Dookudu", "Aagadu"),
                new WordPair("MOVIES_TELUGU", "Bommarillu", "Nuvvostanante Nenoddantana"),
                new WordPair("MOVIES_TELUGU", "Ye Maaya Chesave", "Oohalu Gusagusalade"),
                new WordPair("MOVIES_TELUGU", "Manam", "Seethamma Vakitlo Sirimalle Chettu"),
                new WordPair("MOVIES_TELUGU", "Gopala Gopala", "Oh! Baby"),
                new WordPair("MOVIES_TELUGU", "Waltair Veerayya", "Veera Simha Reddy"),
                new WordPair("MOVIES_TELUGU", "Billa", "Shadow"),
                new WordPair("MOVIES_TELUGU", "Arya", "Arya 2"),
                new WordPair("MOVIES_TELUGU", "Kushi", "Badri"),
                new WordPair("MOVIES_TELUGU", "Arundhati", "Chandramukhi"),
                new WordPair("MOVIES_TELUGU", "Major", "The Ghazi Attack"),
                new WordPair("MOVIES_TELUGU", "Hi Nanna", "Sita Ramam"),
                new WordPair("MOVIES_TELUGU", "Guntur Kaaram", "Sarkaru Vaari Paata"),
                new WordPair("MOVIES_TELUGU", "Dasara", "Balagam"),
                new WordPair("MOVIES_TELUGU", "Virupaksha", "Mangalavaaram")
        ));
    }

    // ==========================================
    // 2. TAMIL CINEMA (Kollywood - 30 pairs)
    // ==========================================
    private List<WordPair> initTamilMoviePacks() {
        return new ArrayList<>(List.of(
                new WordPair("MOVIES_TAMIL", "Kaithi", "Vikram"),
                new WordPair("MOVIES_TAMIL", "Vikram Vedha", "Master"),
                new WordPair("MOVIES_TAMIL", "Jailer", "Leo"),
                new WordPair("MOVIES_TAMIL", "Mankatha", "Billa"),
                new WordPair("MOVIES_TAMIL", "Anniyan (Aparichit)", "Ghajini"),
                new WordPair("MOVIES_TAMIL", "Super Deluxe", "Soodhu Kavvum"),
                new WordPair("MOVIES_TAMIL", "Asuran", "Karnan"),
                new WordPair("MOVIES_TAMIL", "Soorarai Pottru", "Jai Bhim"),
                new WordPair("MOVIES_TAMIL", "Thani Oruvan", "Dhruva"),
                new WordPair("MOVIES_TAMIL", "Petta", "Kabali"),
                new WordPair("MOVIES_TAMIL", "Vada Chennai", "Pudhupettai"),
                new WordPair("MOVIES_TAMIL", "Ratsasan", "Por Thozhil"),
                new WordPair("MOVIES_TAMIL", "96", "Vinnaithaandi Varuvaayaa"),
                new WordPair("MOVIES_TAMIL", "Thuppakki", "Kaththi"),
                new WordPair("MOVIES_TAMIL", "Enthiran (Robot)", "2.0"),
                new WordPair("MOVIES_TAMIL", "Indian (Hindustani)", "Mudhalvan (Nayak)"),
                new WordPair("MOVIES_TAMIL", "Sivaji: The Boss", "Padayappa"),
                new WordPair("MOVIES_TAMIL", "Doctor", "Beast"),
                new WordPair("MOVIES_TAMIL", "Maanaadu", "Mark Antony"),
                new WordPair("MOVIES_TAMIL", "Jigarthanda", "Jigarthanda DoubleX"),
                new WordPair("MOVIES_TAMIL", "Pariyerum Perumal", "Mariyan"),
                new WordPair("MOVIES_TAMIL", "Iruvar", "Aayutha Ezhuthu"),
                new WordPair("MOVIES_TAMIL", "Thevar Magan", "Virumaandi"),
                new WordPair("MOVIES_TAMIL", "Pithamagan", "Sethu"),
                new WordPair("MOVIES_TAMIL", "Ayan", "Ko"),
                new WordPair("MOVIES_TAMIL", "Kadaisi Vivasayi", "Kaaka Muttai"),
                new WordPair("MOVIES_TAMIL", "Theri", "Mersal"),
                new WordPair("MOVIES_TAMIL", "Sivakasi", "Ghilli"),
                new WordPair("MOVIES_TAMIL", "Pizza", "Demonte Colony"),
                new WordPair("MOVIES_TAMIL", "Ponniyin Selvan: I", "Ponniyin Selvan: II")
        ));
    }

    // ==========================================
    // 3. HINDI CINEMA (Bollywood - 30 pairs)
    // ==========================================
    private List<WordPair> initHindiMoviePacks() {
        return new ArrayList<>(List.of(
                new WordPair("MOVIES_HINDI", "Sholay", "Deewaar"),
                new WordPair("MOVIES_HINDI", "Dilwale Dulhania Le Jayenge", "Kuch Kuch Hota Hai"),
                new WordPair("MOVIES_HINDI", "3 Idiots", "Dangal"),
                new WordPair("MOVIES_HINDI", "Lagaan", "Chak De! India"),
                new WordPair("MOVIES_HINDI", "Swades", "Rang De Basanti"),
                new WordPair("MOVIES_HINDI", "Zindagi Na Milegi Dobara", "Dil Chahta Hai"),
                new WordPair("MOVIES_HINDI", "Andhadhun", "Badlapur"),
                new WordPair("MOVIES_HINDI", "Stree", "Bhediya"),
                new WordPair("MOVIES_HINDI", "Tumbbad", "Bramayugam"),
                new WordPair("MOVIES_HINDI", "Gangs of Wasseypur (Part 1)", "Gangs of Wasseypur (Part 2)"),
                new WordPair("MOVIES_HINDI", "Munna Bhai M.B.B.S.", "Lage Raho Munna Bhai"),
                new WordPair("MOVIES_HINDI", "Don (2006)", "Dhoom 2"),
                new WordPair("MOVIES_HINDI", "Queen", "English Vinglish"),
                new WordPair("MOVIES_HINDI", "Kahaani", "Drishyam"),
                new WordPair("MOVIES_HINDI", "Bajrangi Bhaijaan", "Sultan"),
                new WordPair("MOVIES_HINDI", "Kabir Singh", "Animal"),
                new WordPair("MOVIES_HINDI", "Jawan", "Pathaan"),
                new WordPair("MOVIES_HINDI", "Hera Pheri", "Phir Hera Pheri"),
                new WordPair("MOVIES_HINDI", "Barfi!", "Taare Zameen Par"),
                new WordPair("MOVIES_HINDI", "Jab We Met", "Yeh Jawaani Hai Deewani"),
                new WordPair("MOVIES_HINDI", "Gully Boy", "Rockstar"),
                new WordPair("MOVIES_HINDI", "Article 15", "Talvar"),
                new WordPair("MOVIES_HINDI", "Gadar: Ek Prem Katha", "Border"),
                new WordPair("MOVIES_HINDI", "Bhool Bhulaiyaa", "Stree 2"),
                new WordPair("MOVIES_HINDI", "Vicky Donor", "Badhaai Ho"),
                new WordPair("MOVIES_HINDI", "Special 26", "Baby"),
                new WordPair("MOVIES_HINDI", "Omkara", "Haider"),
                new WordPair("MOVIES_HINDI", "Piku", "The Lunchbox"),
                new WordPair("MOVIES_HINDI", "Chupke Chupke", "Gol Maal (1979)"),
                new WordPair("MOVIES_HINDI", "Uri: The Surgical Strike", "Raazi")
        ));
    }

    // ==========================================
    // 4. MALAYALAM CINEMA (Mollywood - 25 pairs)
    // ==========================================
    private List<WordPair> initMalayalamMoviePacks() {
        return new ArrayList<>(List.of(
                new WordPair("MOVIES_MALAYALAM", "Drishyam", "Memories"),
                new WordPair("MOVIES_MALAYALAM", "Lucifer", "Bheeshma Parvam"),
                new WordPair("MOVIES_MALAYALAM", "Premam", "Bangalore Days"),
                new WordPair("MOVIES_MALAYALAM", "Kumbalangi Nights", "Maheshinte Prathikaaram"),
                new WordPair("MOVIES_MALAYALAM", "Aavesham", "Romancham"),
                new WordPair("MOVIES_MALAYALAM", "Manjummel Boys", "2018 (Everyone is a Hero)"),
                new WordPair("MOVIES_MALAYALAM", "Minnal Murali", "Lokah"),
                new WordPair("MOVIES_MALAYALAM", "Joji", "Eeda"),
                new WordPair("MOVIES_MALAYALAM", "Thondimuthalum Driksakshiyum", "Nayattu"),
                new WordPair("MOVIES_MALAYALAM", "Churuli", "Jallikattu"),
                new WordPair("MOVIES_MALAYALAM", "Kurup", "Salute"),
                new WordPair("MOVIES_MALAYALAM", "Neru", "Joseph"),
                new WordPair("MOVIES_MALAYALAM", "Spadikam", "Devasuram"),
                new WordPair("MOVIES_MALAYALAM", "Charlie", "Neelakasham Pachakadal Chuvanna Bhoomi"),
                new WordPair("MOVIES_MALAYALAM", "Virus", "Trance"),
                new WordPair("MOVIES_MALAYALAM", "Kireedam", "Chenkol"),
                new WordPair("MOVIES_MALAYALAM", "Manichitrathazhu", "Chandramukhi"),
                new WordPair("MOVIES_MALAYALAM", "Ustad Hotel", "Android Kunjappan Version 5.25"),
                new WordPair("MOVIES_MALAYALAM", "Sudani from Nigeria", "Thinkalazhcha Nishchayam"),
                new WordPair("MOVIES_MALAYALAM", "Varane Avashyamund", "Hridayam"),
                new WordPair("MOVIES_MALAYALAM", "Bramayugam", "The Goat Life (Aadujeevitham)"),
                new WordPair("MOVIES_MALAYALAM", "Chotta Mumbai", "Rajamanikyam"),
                new WordPair("MOVIES_MALAYALAM", "CID Moosa", "Meesha Madhavan"),
                new WordPair("MOVIES_MALAYALAM", "Traffic", "Nirnayakam"),
                new WordPair("MOVIES_MALAYALAM", "Mumbai Police", "Anjaam Pathiraa")
        ));
    }

    // ==========================================
    // 5. KANNADA CINEMA (Sandalwood - 20 pairs)
    // ==========================================
    private List<WordPair> initKannadaMoviePacks() {
        return new ArrayList<>(List.of(
                new WordPair("MOVIES_KANNADA", "K.G.F: Chapter 1", "K.G.F: Chapter 2"),
                new WordPair("MOVIES_KANNADA", "Kantara", "Garuda Gamana Vrishabha Vahana"),
                new WordPair("MOVIES_KANNADA", "777 Charlie", "Kirik Party"),
                new WordPair("MOVIES_KANNADA", "Ulidavaru Kandanthe", "Lucia"),
                new WordPair("MOVIES_KANNADA", "Ugramm", "Salaar"),
                new WordPair("MOVIES_KANNADA", "Mufti", "Tagaru"),
                new WordPair("MOVIES_KANNADA", "Rangitaranga", "Vikrant Rona"),
                new WordPair("MOVIES_KANNADA", "Bell Bottom", "Shivaji Surathkal"),
                new WordPair("MOVIES_KANNADA", "Dia", "Love Mocktail"),
                new WordPair("MOVIES_KANNADA", "Om", "Jogi"),
                new WordPair("MOVIES_KANNADA", "Kavaludaari", "Birbal Trilogy"),
                new WordPair("MOVIES_KANNADA", "Avane Srimannarayana", "James"),
                new WordPair("MOVIES_KANNADA", "Aa Dinagalu", "Killing Veerappan"),
                new WordPair("MOVIES_KANNADA", "Mungaru Male", "Gaalipata"),
                new WordPair("MOVIES_KANNADA", "Duniya", "Jackie"),
                new WordPair("MOVIES_KANNADA", "Kotigobba 2", "Hebbuli"),
                new WordPair("MOVIES_KANNADA", "Roberrt", "Kurukshetra"),
                new WordPair("MOVIES_KANNADA", "Sapta Sagaradaache Ello - Side A", "Sapta Sagaradaache Ello - Side B"),
                new WordPair("MOVIES_KANNADA", "Hostel Hudugaru Bekagiddare", "Daredevil Musthafa"),
                new WordPair("MOVIES_KANNADA", "Yuva", "Raajakumara")
        ));
    }

    // ==========================================
    // Real World Packs (Food, Tech, Sports, etc.)
    // ==========================================
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
                new WordPair("FOOD", "Gongura Mutton", "Andhra Chicken Curry")
        ));
    }

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
                new WordPair("TECH", "Dark Mode", "Light Mode")
        ));
    }

    private List<WordPair> initSportsPacks() {
        return new ArrayList<>(List.of(
                new WordPair("SPORTS", "Cricket", "Football (Soccer)"),
                new WordPair("SPORTS", "Virat Kohli", "Rohit Sharma"),
                new WordPair("SPORTS", "MS Dhoni", "Sachin Tendulkar"),
                new WordPair("SPORTS", "Lionel Messi", "Cristiano Ronaldo"),
                new WordPair("SPORTS", "Lawn Tennis", "Badminton"),
                new WordPair("SPORTS", "Chess", "Carrom Board"),
                new WordPair("SPORTS", "Gym Weightlifting", "Outdoor Running"),
                new WordPair("SPORTS", "IPL T20", "Cricket World Cup")
        ));
    }

    private List<WordPair> initCampusPacks() {
        return new ArrayList<>(List.of(
                new WordPair("CAMPUS", "Hostel Room", "Day Scholar Home"),
                new WordPair("CAMPUS", "College Canteen", "Hostel Mess Food"),
                new WordPair("CAMPUS", "Mid-Term Exam", "Final Semester Exam"),
                new WordPair("CAMPUS", "Backlog Arrear Exam", "Campus Placement Offer"),
                new WordPair("CAMPUS", "Night Before Exam Cramming", "Early Morning Revision"),
                new WordPair("CAMPUS", "Proxy Attendance", "Strict Biometric Scanner")
        ));
    }

    private List<WordPair> initTravelPacks() {
        return new ArrayList<>(List.of(
                new WordPair("TRAVEL", "Tropical Beach Holiday", "Snowy Mountain Trekking"),
                new WordPair("TRAVEL", "Goa Beach Party", "Manali Snow Valley"),
                new WordPair("TRAVEL", "Hyderabad City", "Bengaluru Garden City"),
                new WordPair("TRAVEL", "2-Hour Flight Journey", "Overnight Sleeper Train")
        ));
    }

    private List<WordPair> initLifestylePacks() {
        return new ArrayList<>(List.of(
                new WordPair("LIFESTYLE", "Early Morning 6 AM Person", "Late 3 AM Night Owl"),
                new WordPair("LIFESTYLE", "Work From Home (WFH) in Pajamas", "Dressed Up Office Cubicle"),
                new WordPair("LIFESTYLE", "Instant Online Shopping", "Bargaining at Local Street Bazaar"),
                new WordPair("LIFESTYLE", "Credit Card Cashback", "Cash / Instant UPI QR Scan")
        ));
    }

    private List<WordPair> initAnimalsPacks() {
        return new ArrayList<>(List.of(
                new WordPair("ANIMALS", "Loyal Pet Dog", "Independent Pet Cat"),
                new WordPair("ANIMALS", "Roaring Savannah Lion", "Stealthy Royal Bengal Tiger"),
                new WordPair("ANIMALS", "Playful Dolphin", "Apex Great White Shark")
        ));
    }

    private List<WordPair> initCareersPacks() {
        return new ArrayList<>(List.of(
                new WordPair("CAREERS", "Fast-Paced High-Growth Startup", "Stable Corporate MNC"),
                new WordPair("CAREERS", "Software Engineer (Coder)", "Product Manager (Vision & Roadmap)"),
                new WordPair("CAREERS", "Freelance Independent Consultant", "Full-Time 9-to-5 Salaried Job")
        ));
    }

    public List<WordPair> addVsPairs(CustomVsRequest req) {
        String cat = (req.getCategory() != null && !req.getCategory().isBlank())
                ? req.getCategory().trim().toUpperCase().replaceAll("\\s+", "_")
                : "CUSTOM_VS";
        List<WordPair> newPairs = new ArrayList<>();

        if (req.getPairs() != null) {
            for (CustomVsRequest.CustomVsItem item : req.getPairs()) {
                if (item.getWordA() != null && !item.getWordA().isBlank() &&
                    item.getWordB() != null && !item.getWordB().isBlank()) {
                    newPairs.add(new WordPair(cat, item.getWordA().trim(), item.getWordB().trim()));
                }
            }
        }

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

        List<CustomWordPairEntity> entities = newPairs.stream().map(p -> CustomWordPairEntity.builder()
                .category(cat)
                .wordA(p.getWordA())
                .wordB(p.getWordB())
                .createdAt(System.currentTimeMillis())
                .build()).toList();
        customWordPairRepo.saveAll(entities);

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
     */
    public WordPair getUnusedPair(String category, Set<String> excludedKeys) {
        String cat = (category != null ? category.toUpperCase().trim() : "ALL_INDIAN_CINEMA");

        // Map general movie aliases to ALL_INDIAN_CINEMA
        if ("MOVIES".equals(cat) || "ALL_MOVIES".equals(cat) || "ALL_INDIAN".equals(cat)) {
            cat = "ALL_INDIAN_CINEMA";
        }

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
                List<WordPair> fallback = packs.get("ALL_INDIAN_CINEMA");
                if (fallback != null) candidatePool.addAll(fallback);
            }
        }

        if (candidatePool.isEmpty()) {
            return new WordPair("MOVIES_TELUGU", "Pokiri", "Businessman");
        }

        // Filter out pairs that have already been played in this room
        List<WordPair> freshPool = new ArrayList<>();
        for (WordPair p : candidatePool) {
            if (excludedKeys == null || !excludedKeys.contains(p.getCanonicalKey())) {
                freshPool.add(p);
            }
        }

        // If all pairs in this pool have been played, cycle over
        if (freshPool.isEmpty()) {
            freshPool = new ArrayList<>(candidatePool);
            if (excludedKeys != null) {
                for (WordPair p : candidatePool) {
                    excludedKeys.remove(p.getCanonicalKey());
                }
            }
        }

        return freshPool.get(random.nextInt(freshPool.size()));
    }

    public WordPair getRandomPair(String category) {
        return getUnusedPair(category, null);
    }

    public Map<String, Integer> getAvailablePacks() {
        Map<String, Integer> summary = new LinkedHashMap<>();
        packs.forEach((k, v) -> summary.put(k, v.size()));
        return summary;
    }

    public void addCustomPairs(String category, List<WordPair> newPairs) {
        if (newPairs != null && !newPairs.isEmpty()) {
            packs.computeIfAbsent(category.toUpperCase(), k -> new ArrayList<>()).addAll(newPairs);
        }
    }
}
