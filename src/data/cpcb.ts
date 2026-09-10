import type { Spot } from "@/lib/types";

const CITATION = {
  label: "CPCB — Polluted River Stretches for Restoration of Water Quality, 2025",
  url: "https://cpcb.nic.in/",
  date: "2025",
} as const;

/** Compact rows: priority|state|city|lat|lng|river|stretch */
const TSV = `
1|Delhi|Delhi|28.7041|77.2275|Yamuna|Palla to Asgarpur
1|Gujarat|Ahmedabad|23.0225|72.5714|Sabarmati|Ahmedabad urban stretch
1|Madhya Pradesh|Nagda|23.4564|75.4170|Chambal|Nagda to Gandhi Sagar
1|Karnataka|Harihar|14.5128|75.8074|Tungabhadra|Harihar to Hampi stretch
1|Tamil Nadu|Salem|11.6643|78.1460|Sarabanga|Salem district stretch
1|Uttar Pradesh|Ghaziabad|28.6692|77.4538|Hindon|Saharanpur to Ghaziabad
1|Uttar Pradesh|Kanpur|26.4499|80.3319|Ganga|Bithoor to Jajmau
1|Uttar Pradesh|Moradabad|28.8386|78.7733|Ramganga|Moradabad stretch
1|Uttar Pradesh|Muzaffarnagar|29.4727|77.7085|Kali East|Muzaffarnagar stretch
1|Uttar Pradesh|Unnao|26.5390|80.4878|Ganga|Unnao industrial stretch
1|Uttarakhand|Haridwar|29.9457|78.1642|Ganga|Haridwar to Bijnor
1|Uttarakhand|Kashipur|29.2104|78.9615|Kosi|Kashipur stretch
1|Uttarakhand|Rudrapur|28.9800|79.4000|Dhela|Rudrapur stretch
1|Uttarakhand|Rishikesh|30.0869|78.2676|Ganga|Rishikesh urban stretch
1|Uttarakhand|Haldwani|29.2183|79.5130|Baur|Haldwani stretch
1|Gujarat|Vapi|20.3893|72.9106|Damanganga|Vapi industrial stretch
1|Gujarat|Ankleshwar|21.6274|73.0000|Amlakhadi|Ankleshwar stretch
1|Gujarat|Vadodara|22.3072|73.1812|Vishwamitri|Vadodara stretch
1|Karnataka|Bengaluru|12.9141|77.4850|Vrishabhavathi|Peenya to Byramangala
1|Karnataka|Bhadravati|13.8399|75.7050|Bhadra|Bhadravati stretch
1|Tamil Nadu|Tiruppur|11.1085|77.3411|Noyyal|Tiruppur to Erode
1|Tamil Nadu|Chennai|13.0604|80.2496|Cooum|Chennai urban stretch
1|Tamil Nadu|Chennai|13.0067|80.2567|Adyar|Chennai urban stretch
1|Tamil Nadu|Erode|11.3410|77.7172|Cauvery|Erode to Karur
1|Maharashtra|Mumbai|19.0650|72.8680|Mithi|Mahim Creek to Dharavi
1|Maharashtra|Pune|18.5204|73.8567|Mula-Mutha|Pune urban stretch
1|Telangana|Hyderabad|17.3850|78.4867|Musi|Hyderabad urban stretch
1|Haryana|Panipat|29.3909|76.9635|Yamuna|Panipat to Sonepat
1|Punjab|Ludhiana|30.9010|75.8573|Buddha Nullah|Ludhiana stretch
1|Punjab|Ludhiana|30.9000|75.8500|Satluj|Ludhiana to Harike
1|West Bengal|Durgapur|23.5204|87.3119|Damodar|Durgapur stretch
1|Odisha|Cuttack|20.4625|85.8830|Mahanadi|Cuttack urban stretch
1|Rajasthan|Kota|25.2138|75.8648|Chambal|Kota stretch
1|Bihar|Patna|25.5941|85.1376|Ganga|Patna urban stretch
1|Andhra Pradesh|Vijayawada|16.5062|80.6480|Krishna|Vijayawada stretch
1|Kerala|Kochi|10.0261|76.3105|Periyar|Eloor to Kochi
1|Assam|Guwahati|26.1445|91.7362|Bharalu|Guwahati stretch
2|Maharashtra|Nashik|19.9975|73.7898|Godavari|Nashik stretch
2|Maharashtra|Kolhapur|16.7050|74.2433|Panchaganga|Kolhapur stretch
2|Maharashtra|Nagpur|21.1458|79.0882|Nag|Nagpur stretch
2|Maharashtra|Nagpur|21.1600|79.0900|Kanhan|Nagpur stretch
2|Maharashtra|Thane|19.2183|72.9781|Ulhas|Ulhasnagar to Thane
2|Maharashtra|Navi Mumbai|19.0330|73.0297|Patalganga|Rasayani stretch
2|Maharashtra|Aurangabad|19.8762|75.3433|Kham|Aurangabad stretch
2|Maharashtra|Solapur|17.6599|75.9064|Sina|Solapur stretch
2|Maharashtra|Sangli|16.8524|74.5815|Krishna|Sangli-Miraj stretch
2|Maharashtra|Jalgaon|21.0077|75.5626|Girna|Jalgaon stretch
2|Maharashtra|Ahmednagar|19.0948|74.7480|Sina|Ahmednagar stretch
2|Maharashtra|Nanded|19.1383|77.3210|Godavari|Nanded stretch
2|Maharashtra|Chandrapur|19.9703|79.3035|Wardha|Chandrapur stretch
2|Maharashtra|Gondia|21.4549|80.1960|Wainganga|Gondia stretch
2|Maharashtra|Ratnagiri|16.9902|73.3120|Muchkundi|Ratnagiri stretch
2|Maharashtra|Alibag|18.6411|72.8723|Kundalika|Roha stretch
2|Maharashtra|Kalyan|19.2403|73.1305|Kalu|Kalyan stretch
2|Maharashtra|Bhiwandi|19.2813|73.0486|Kamvari|Bhiwandi stretch
2|Maharashtra|Pimpri-Chinchwad|18.6298|73.7997|Pawana|PCMC stretch
2|Maharashtra|Satara|17.6805|74.0183|Venna|Satara stretch
2|Maharashtra|Latur|18.4088|76.5604|Manjara|Latur stretch
2|Maharashtra|Akola|20.7000|77.0080|Morna|Akola stretch
2|Maharashtra|Amravati|20.9374|77.7796|Pedhi|Amravati stretch
2|Maharashtra|Dhule|20.9042|74.7749|Panjhra|Dhule stretch
2|Maharashtra|Yavatmal|20.3888|78.1204|Penganga|Yavatmal stretch
2|Maharashtra|Wardha|20.7453|78.6022|Wardha|Wardha stretch
2|Maharashtra|Jalna|19.8343|75.8816|Kundalika|Jalna stretch
2|Maharashtra|Osmanabad|18.1860|76.0419|Bori|Osmanabad stretch
2|Maharashtra|Beed|18.9891|75.7601|Sindphana|Beed stretch
2|Maharashtra|Parbhani|19.2608|76.7767|Dudhana|Parbhani stretch
2|Maharashtra|Hingoli|19.7179|77.1481|Purna|Hingoli stretch
2|Maharashtra|Washim|20.1110|77.1330|Arunavati|Washim stretch
2|Maharashtra|Bhandara|21.1700|79.6500|Wainganga|Bhandara stretch
2|Maharashtra|Gadchiroli|19.8000|80.2000|Indravati|Gadchiroli stretch
2|Maharashtra|Sindhudurg|16.0000|73.6900|Karli|Sindhudurg stretch
2|Maharashtra|Palghar|19.6967|72.7699|Vaitarna|Palghar stretch
2|Maharashtra|Raigad|18.6500|73.1500|Amba|Khopoli stretch
2|Maharashtra|Mumbai|19.0400|72.8400|Ohiwara|Malad creek
2|Maharashtra|Mumbai|19.1550|72.8500|Poisar|Kandivali stretch
2|Maharashtra|Mumbai|19.2100|72.8600|Dahisar|Dahisar stretch
2|Maharashtra|Nashik|20.0000|73.7800|Darna|Igatpuri to Nashik
2|Maharashtra|Nagpur|21.0900|79.0700|Pili|Nagpur stretch
2|Maharashtra|Kolhapur|16.6900|74.2300|Bhogawati|Kolhapur stretch
2|Maharashtra|Pune|18.5000|73.8500|Ramnadi|Pune stretch
2|Maharashtra|Pune|18.5600|73.8900|Devnadi|Pune stretch
2|Maharashtra|Thane|19.1800|72.9800|Kasadi|Thane stretch
2|Maharashtra|Navi Mumbai|19.0000|73.1100|Panvel Creek|Panvel stretch
2|Maharashtra|Aurangabad|19.8700|75.3200|Shivna|Aurangabad stretch
2|Maharashtra|Solapur|17.6700|75.9100|Bhima|Pandharpur stretch
2|Maharashtra|Sangli|16.8600|74.5600|Warna|Sangli stretch
2|Maharashtra|Nanded|19.1500|77.3000|Asna|Nanded stretch
2|Kerala|Alappuzha|9.4981|76.3388|Pamba|Alappuzha stretch
2|Kerala|Thrissur|10.5276|76.2144|Karuvannur|Thrissur stretch
2|Kerala|Kollam|8.8932|76.6141|Kallada|Kollam stretch
2|Kerala|Kozhikode|11.2588|75.7804|Kallayi|Kozhikode stretch
2|Kerala|Kannur|11.8745|75.3704|Valapattanam|Kannur stretch
2|Kerala|Kottayam|9.5916|76.5222|Meenachil|Kottayam stretch
2|Kerala|Palakkad|10.7867|76.6548|Bharathapuzha|Palakkad stretch
2|Kerala|Malappuram|11.0500|76.0700|Kadalundi|Malappuram stretch
2|Kerala|Ernakulam|9.9800|76.2800|Chitrapuzha|Ernakulam stretch
2|Kerala|Thiruvananthapuram|8.5241|76.9366|Karamana|Thiruvananthapuram stretch
2|Kerala|Idukki|9.8500|76.9700|Periyar|Idukki stretch
2|Kerala|Pathanamthitta|9.2648|76.7870|Achenkovil|Pathanamthitta stretch
2|Kerala|Kasaragod|12.4996|74.9869|Chandragiri|Kasaragod stretch
2|Kerala|Wayanad|11.6854|76.1320|Kabani|Wayanad stretch
2|Kerala|Aluva|10.1004|76.3570|Periyar|Aluva stretch
2|Kerala|Kodungallur|10.2200|76.2200|Chalakudy|Kodungallur stretch
2|Kerala|Punalur|9.0167|76.9260|Kallada|Punalur stretch
2|Kerala|Varkala|8.7379|76.7163|Vamanapuram|Varkala stretch
2|Kerala|Muvattupuzha|9.9794|76.5741|Muvattupuzha|Muvattupuzha stretch
2|Kerala|Changanassery|9.4420|76.5410|Pamba|Changanassery stretch
2|Kerala|Thalassery|11.7490|75.4900|Anjarakandy|Thalassery stretch
2|Kerala|Ponnani|10.7670|75.9250|Bharathapuzha|Ponnani estuary
2|Kerala|Beypore|11.1800|75.8100|Chaliyar|Beypore stretch
2|Kerala|Vadakara|11.6080|75.5910|Mahe|Vadakara stretch
2|Kerala|Attingal|8.6980|76.8150|Vamanapuram|Attingal stretch
2|Kerala|Perumbavoor|10.1150|76.4770|Periyar|Perumbavoor stretch
2|Kerala|Kothamangalam|10.0600|76.6200|Kaliyar|Kothamangalam stretch
2|Kerala|Cherthala|9.6840|76.3360|Vembanad|Cherthala backwaters
2|Kerala|Haripad|9.2850|76.4480|Pamba|Haripad stretch
2|Kerala|Kayamkulam|9.1650|76.5000|Achankovil|Kayamkulam stretch
2|Kerala|Nedumangad|8.6030|77.0030|Karamana|Nedumangad stretch
2|Madhya Pradesh|Indore|22.7196|75.8577|Khan|Indore stretch
2|Madhya Pradesh|Ujjain|23.1765|75.7885|Kshipra|Ujjain ghats
2|Madhya Pradesh|Bhopal|23.2599|77.4126|Patra|Bhopal stretch
2|Madhya Pradesh|Jabalpur|23.1815|79.9864|Narmada|Jabalpur stretch
2|Madhya Pradesh|Gwalior|26.2183|78.1828|Swarna Rekha|Gwalior stretch
2|Madhya Pradesh|Ujjain|23.1800|75.7700|Gambhir|Ujjain stretch
2|Madhya Pradesh|Dewas|22.9623|76.0508|Kshipra|Dewas stretch
2|Madhya Pradesh|Ratlam|23.3315|75.0367|Kurel|Ratlam stretch
2|Madhya Pradesh|Sagar|23.8388|78.7378|Bewas|Sagar stretch
2|Madhya Pradesh|Rewa|24.5362|81.2961|Bichhia|Rewa stretch
2|Madhya Pradesh|Satna|24.6005|80.8322|Tons|Satna stretch
2|Madhya Pradesh|Chhindwara|22.0574|78.9382|Kanhan|Chhindwara stretch
2|Madhya Pradesh|Khandwa|21.8257|76.3526|Narmada|Khandwa stretch
2|Madhya Pradesh|Burhanpur|21.3142|76.2320|Tapti|Burhanpur stretch
2|Madhya Pradesh|Mandsaur|24.0768|75.0690|Shivna|Mandsaur stretch
2|Madhya Pradesh|Neemuch|24.4764|74.8624|Gambhir|Neemuch stretch
2|Manipur|Imphal|24.8170|93.9368|Nambul|Imphal stretch
2|Manipur|Imphal|24.8300|93.9400|Imphal|Imphal urban stretch
2|Manipur|Thoubal|24.6380|94.0000|Thoubal|Thoubal stretch
2|Manipur|Bishnupur|24.6270|93.7600|Khuga|Bishnupur stretch
2|Manipur|Churachandpur|24.3330|93.6830|Khuga|Churachandpur stretch
2|Manipur|Kakching|24.4980|93.9810|Sekmai|Kakching stretch
2|Manipur|Imphal|24.8000|93.9200|Kongba|Imphal stretch
2|Manipur|Imphal|24.8100|93.9500|Iril|Imphal stretch
2|Manipur|Thoubal|24.6500|93.9900|Wangjing|Thoubal stretch
2|Manipur|Bishnupur|24.6100|93.7700|Nambol|Bishnupur stretch
2|Manipur|Imphal West|24.7600|93.8900|Merakhong|Imphal West stretch
2|Manipur|Imphal East|24.8500|93.9800|Yangoi|Imphal East stretch
2|Manipur|Kakching|24.5100|93.9700|Chakpi|Kakching stretch
2|Manipur|Thoubal|24.6700|94.0200|Arong|Thoubal stretch
2|Manipur|Imphal|24.7900|93.9300|Waishel|Imphal stretch
2|Manipur|Bishnupur|24.6400|93.7500|Thongjaorok|Bishnupur stretch
2|Manipur|Churachandpur|24.3500|93.7000|Tuitha|Churachandpur stretch
2|Manipur|Imphal|24.8200|93.9100|Maklang|Imphal stretch
2|Karnataka|Bengaluru|13.0350|77.5900|Hebbal|Hebbal valley
2|Karnataka|Mysuru|12.2958|76.6394|Kabini|Mysuru stretch
2|Karnataka|Mangaluru|12.9141|74.8560|Netravati|Mangaluru stretch
2|Karnataka|Hubballi|15.3647|75.1240|Tungabhadra|Hubballi stretch
2|Karnataka|Belagavi|15.8497|74.4977|Markandeya|Belagavi stretch
2|Karnataka|Kalaburagi|17.3297|76.8343|Bhima|Kalaburagi stretch
2|Karnataka|Ballari|15.1394|76.9214|Tungabhadra|Ballari stretch
2|Karnataka|Davanagere|14.4644|75.9218|Tungabhadra|Davanagere stretch
2|Karnataka|Shivamogga|13.9299|75.5681|Tunga|Shivamogga stretch
2|Karnataka|Tumakuru|13.3409|77.1010|Jayamangali|Tumakuru stretch
2|Karnataka|Raichur|16.2120|77.3439|Krishna|Raichur stretch
2|Karnataka|Vijayapura|16.8302|75.7100|Doni|Vijayapura stretch
2|Tamil Nadu|Madurai|9.9252|78.1198|Vaigai|Madurai stretch
2|Tamil Nadu|Tiruchirappalli|10.7905|78.7047|Cauvery|Tiruchirappalli stretch
2|Tamil Nadu|Coimbatore|11.0168|76.9558|Noyyal|Coimbatore stretch
2|Tamil Nadu|Vellore|12.9165|79.1325|Palar|Vellore stretch
2|Tamil Nadu|Tirunelveli|8.7139|77.7567|Tamiraparani|Tirunelveli stretch
2|Tamil Nadu|Thoothukudi|8.7642|78.1348|Tamiraparani|Thoothukudi stretch
2|Tamil Nadu|Cuddalore|11.7480|79.7714|Thenpennai|Cuddalore stretch
2|Tamil Nadu|Nagapattinam|10.7672|79.8449|Cauvery|Nagapattinam stretch
2|Tamil Nadu|Karur|10.9601|78.0766|Amaravathi|Karur stretch
2|Tamil Nadu|Dindigul|10.3673|77.9803|Kodaganar|Dindigul stretch
2|Gujarat|Surat|21.1702|72.8311|Tapi|Surat stretch
2|Gujarat|Rajkot|22.3039|70.8022|Aji|Rajkot stretch
2|Gujarat|Bhavnagar|21.7645|72.1519|Malan|Bhavnagar stretch
2|Gujarat|Jamnagar|22.4707|70.0577|Rangmati|Jamnagar stretch
2|Gujarat|Gandhinagar|23.2156|72.6369|Sabarmati|Gandhinagar stretch
2|Gujarat|Bharuch|21.7051|72.9959|Narmada|Bharuch stretch
2|Gujarat|Nadiad|22.6916|72.8634|Shedhi|Nadiad stretch
2|Gujarat|Mehsana|23.5880|72.3693|Rupen|Mehsana stretch
2|Gujarat|Junagadh|21.5222|70.4579|Ozat|Junagadh stretch
2|Gujarat|Morbi|22.8170|70.8370|Machhu|Morbi stretch
3|West Bengal|Kolkata|22.5726|88.3639|Hooghly|Kolkata urban stretch
3|West Bengal|Asansol|23.6889|86.9661|Damodar|Asansol stretch
3|West Bengal|Siliguri|26.7271|88.3953|Mahananda|Siliguri stretch
3|West Bengal|Howrah|22.5958|88.2636|Hooghly|Howrah stretch
3|West Bengal|Bardhaman|23.2324|87.8615|Damodar|Bardhaman stretch
3|West Bengal|Malda|25.0108|88.1411|Mahananda|Malda stretch
3|West Bengal|Baharampur|24.1000|88.2500|Bhagirathi|Baharampur stretch
3|West Bengal|Kharagpur|22.3460|87.2320|Kansabati|Kharagpur stretch
3|Bihar|Bhagalpur|25.2425|86.9842|Ganga|Bhagalpur stretch
3|Bihar|Muzaffarpur|26.1209|85.3647|Burhi Gandak|Muzaffarpur stretch
3|Bihar|Gaya|24.7955|85.0000|Falgu|Gaya stretch
3|Bihar|Begusarai|25.4182|86.1272|Ganga|Begusarai stretch
3|Bihar|Purnia|25.7771|87.4753|Kosi|Purnia stretch
3|Bihar|Darbhanga|26.1542|85.8918|Bagmati|Darbhanga stretch
3|Jharkhand|Ranchi|23.3441|85.3096|Subarnarekha|Ranchi stretch
3|Jharkhand|Jamshedpur|22.8046|86.2029|Subarnarekha|Jamshedpur stretch
3|Jharkhand|Dhanbad|23.7957|86.4304|Damodar|Dhanbad stretch
3|Jharkhand|Bokaro|23.6693|86.1511|Damodar|Bokaro stretch
3|Odisha|Bhubaneswar|20.2961|85.8245|Daya|Bhubaneswar stretch
3|Odisha|Rourkela|22.2604|84.8536|Brahmani|Rourkela stretch
3|Odisha|Sambalpur|21.4669|83.9812|Mahanadi|Sambalpur stretch
3|Odisha|Puri|19.8135|85.8312|Bhargavi|Puri stretch
3|Odisha|Berhampur|19.3150|84.7941|Rushikulya|Berhampur stretch
3|Assam|Dibrugarh|27.4728|94.9120|Brahmaputra|Dibrugarh stretch
3|Assam|Silchar|24.8333|92.7789|Barak|Silchar stretch
3|Assam|Nagaon|26.3500|92.6900|Kolong|Nagaon stretch
3|Assam|Jorhat|26.7509|94.2037|Bhogdoi|Jorhat stretch
3|Assam|Tezpur|26.6338|92.8000|Brahmaputra|Tezpur stretch
3|Assam|Tinsukia|27.4922|95.3468|Buru Dihing|Tinsukia stretch
3|Meghalaya|Shillong|25.5788|91.8933|Umkhrah|Shillong stretch
3|Meghalaya|Shillong|25.5600|91.8800|Umshyrpi|Shillong stretch
3|Tripura|Agartala|23.8315|91.2868|Haora|Agartala stretch
3|Nagaland|Dimapur|25.9091|93.7266|Dhansiri|Dimapur stretch
3|Mizoram|Aizawl|23.7271|92.7176|Tlawng|Aizawl stretch
3|Arunachal Pradesh|Itanagar|27.0844|93.6053|Dikrang|Itanagar stretch
3|Sikkim|Gangtok|27.3389|88.6065|Rani Khola|Gangtok stretch
3|Goa|Panaji|15.4909|73.8278|Mandovi|Panaji stretch
3|Goa|Margao|15.2832|73.9862|Sal|Margao stretch
3|Goa|Mapusa|15.5916|73.8090|Mapusa|Mapusa stretch
3|Goa|Vasco|15.3982|73.8113|Zuari|Vasco stretch
3|Rajasthan|Jaipur|26.9124|75.7873|Dhundh|Jaipur stretch
3|Rajasthan|Udaipur|24.5854|73.7125|Ahar|Udaipur stretch
3|Rajasthan|Jodhpur|26.2389|73.0243|Jojari|Jodhpur stretch
3|Rajasthan|Ajmer|26.4499|74.6399|Bandi|Ajmer stretch
3|Rajasthan|Bharatpur|27.2152|77.5030|Banganga|Bharatpur stretch
3|Rajasthan|Bhilwara|25.3470|74.6400|Banas|Bhilwara stretch
3|Rajasthan|Alwar|27.5530|76.6346|Sabi|Alwar stretch
3|Haryana|Faridabad|28.4089|77.3178|Yamuna|Faridabad stretch
3|Haryana|Gurugram|28.4595|77.0266|Sahibi|Gurugram stretch
3|Haryana|Yamunanagar|30.1290|77.2674|Yamuna|Yamunanagar stretch
3|Haryana|Hisar|29.1492|75.7217|Ghaggar|Hisar stretch
3|Haryana|Karnal|29.6857|76.9905|Yamuna|Karnal stretch
3|Punjab|Amritsar|31.6340|74.8723|Ravi|Amritsar stretch
3|Punjab|Jalandhar|31.3260|75.5762|Kali Bein|Jalandhar stretch
3|Punjab|Patiala|30.3398|76.3869|Ghaggar|Patiala stretch
3|Punjab|Bathinda|30.2110|74.9455|Ghaggar|Bathinda stretch
3|Himachal Pradesh|Shimla|31.1048|77.1734|Ashwani|Shimla stretch
3|Himachal Pradesh|Mandi|31.7080|76.9320|Beas|Mandi stretch
3|Himachal Pradesh|Kangra|32.0998|76.2691|Beas|Kangra stretch
3|Jammu and Kashmir|Jammu|32.7266|74.8570|Tawi|Jammu stretch
3|Jammu and Kashmir|Srinagar|34.0837|74.7973|Jhelum|Srinagar stretch
3|Andhra Pradesh|Visakhapatnam|17.6868|83.2185|Gambheeram|Visakhapatnam stretch
3|Andhra Pradesh|Tirupati|13.6288|79.4192|Swarnamukhi|Tirupati stretch
3|Andhra Pradesh|Guntur|16.3067|80.4365|Krishna|Guntur stretch
3|Andhra Pradesh|Rajahmundry|17.0005|81.8040|Godavari|Rajahmundry stretch
3|Andhra Pradesh|Kurnool|15.8281|78.0373|Tungabhadra|Kurnool stretch
3|Andhra Pradesh|Nellore|14.4426|79.9865|Penna|Nellore stretch
3|Telangana|Warangal|17.9689|79.5941|Godavari|Warangal stretch
3|Telangana|Nizamabad|18.6725|78.0941|Godavari|Nizamabad stretch
3|Telangana|Karimnagar|18.4386|79.1288|Manair|Karimnagar stretch
3|Telangana|Khammam|17.2473|80.1514|Munneru|Khammam stretch
3|Chhattisgarh|Raipur|21.2514|81.6296|Kharun|Raipur stretch
3|Chhattisgarh|Bilaspur|22.0796|82.1391|Arpa|Bilaspur stretch
3|Chhattisgarh|Bhilai|21.1938|81.3509|Sheonath|Bhilai stretch
3|Chhattisgarh|Korba|22.3595|82.7501|Hasdeo|Korba stretch
3|Chhattisgarh|Raigarh|21.8974|83.3950|Kelo|Raigarh stretch
4|Puducherry|Puducherry|11.9416|79.8083|Sankaraparani|Puducherry stretch
4|Chandigarh|Chandigarh|30.7333|76.7794|Patiala ki Rao|Chandigarh stretch
4|Delhi|Delhi|28.6129|77.2295|Yamuna|ITO to Okhla
4|Delhi|Delhi|28.6500|77.2500|Najafgarh Drain|West Delhi
4|Dadra and Nagar Haveli|Silvassa|20.2760|73.0080|Damanganga|Silvassa stretch
`.trim();

export const CPCB_SPOTS: Spot[] = TSV.split("\n").map((line, index) => {
  const [priority, state, city, lat, lng, river, stretch] = line.split("|");
  const p = Number(priority) as 1 | 2 | 3 | 4 | 5;
  return {
    id: `cpcb-${String(index + 1).padStart(3, "0")}`,
    name: `${river}: ${stretch}`,
    nameHi: river,
    category: "river" as const,
    status: "dirty" as const,
    source: "cpcb" as const,
    lat: Number(lat),
    lng: Number(lng),
    state,
    city,
    description: `Polluted river stretch identified by CPCB under the National Water Quality Monitoring Programme. Location is an approximate centroid of the named stretch, not a monitoring-station coordinate.`,
    cpcbPriority: p,
    sourceCitation: CITATION,
    updatedAt: "2025-01-01",
  };
});
