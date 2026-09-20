
-- Seed delivery settings
INSERT INTO public.delivery_settings (delivery_type, charge, status) VALUES
  ('inside_dhaka', 60, true),
  ('outside_dhaka', 120, true)
ON CONFLICT DO NOTHING;

-- Seed all 64 districts of Bangladesh
INSERT INTO public.districts (name, name_bn, division) VALUES
  ('Dhaka', 'ঢাকা', 'Dhaka'),
  ('Faridpur', 'ফরিদপুর', 'Dhaka'),
  ('Gazipur', 'গাজীপুর', 'Dhaka'),
  ('Gopalganj', 'গোপালগঞ্জ', 'Dhaka'),
  ('Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka'),
  ('Madaripur', 'মাদারীপুর', 'Dhaka'),
  ('Manikganj', 'মানিকগঞ্জ', 'Dhaka'),
  ('Munshiganj', 'মুন্সীগঞ্জ', 'Dhaka'),
  ('Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka'),
  ('Narsingdi', 'নরসিংদী', 'Dhaka'),
  ('Rajbari', 'রাজবাড়ী', 'Dhaka'),
  ('Shariatpur', 'শরীয়তপুর', 'Dhaka'),
  ('Tangail', 'টাঙ্গাইল', 'Dhaka'),
  ('Chittagong', 'চট্টগ্রাম', 'Chittagong'),
  ('Bandarban', 'বান্দরবান', 'Chittagong'),
  ('Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chittagong'),
  ('Chandpur', 'চাঁদপুর', 'Chittagong'),
  ('Comilla', 'কুমিল্লা', 'Chittagong'),
  ('Coxs Bazar', 'কক্সবাজার', 'Chittagong'),
  ('Feni', 'ফেনী', 'Chittagong'),
  ('Khagrachhari', 'খাগড়াছড়ি', 'Chittagong'),
  ('Lakshmipur', 'লক্ষ্মীপুর', 'Chittagong'),
  ('Noakhali', 'নোয়াখালী', 'Chittagong'),
  ('Rangamati', 'রাঙ্গামাটি', 'Chittagong'),
  ('Rajshahi', 'রাজশাহী', 'Rajshahi'),
  ('Bogra', 'বগুড়া', 'Rajshahi'),
  ('Chapainawabganj', 'চাঁপাইনবাবগঞ্জ', 'Rajshahi'),
  ('Joypurhat', 'জয়পুরহাট', 'Rajshahi'),
  ('Naogaon', 'নওগাঁ', 'Rajshahi'),
  ('Natore', 'নাটোর', 'Rajshahi'),
  ('Nawabganj', 'নবাবগঞ্জ', 'Rajshahi'),
  ('Pabna', 'পাবনা', 'Rajshahi'),
  ('Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi'),
  ('Khulna', 'খুলনা', 'Khulna'),
  ('Bagerhat', 'বাগেরহাট', 'Khulna'),
  ('Chuadanga', 'চুয়াডাঙ্গা', 'Khulna'),
  ('Jessore', 'যশোর', 'Khulna'),
  ('Jhenaidah', 'ঝিনাইদহ', 'Khulna'),
  ('Kushtia', 'কুষ্টিয়া', 'Khulna'),
  ('Magura', 'মাগুরা', 'Khulna'),
  ('Meherpur', 'মেহেরপুর', 'Khulna'),
  ('Narail', 'নড়াইল', 'Khulna'),
  ('Satkhira', 'সাতক্ষীরা', 'Khulna'),
  ('Barisal', 'বরিশাল', 'Barisal'),
  ('Barguna', 'বরগুনা', 'Barisal'),
  ('Bhola', 'ভোলা', 'Barisal'),
  ('Jhalokati', 'ঝালকাঠি', 'Barisal'),
  ('Patuakhali', 'পটুয়াখালী', 'Barisal'),
  ('Pirojpur', 'পিরোজপুর', 'Barisal'),
  ('Sylhet', 'সিলেট', 'Sylhet'),
  ('Habiganj', 'হবিগঞ্জ', 'Sylhet'),
  ('Moulvibazar', 'মৌলভীবাজার', 'Sylhet'),
  ('Sunamganj', 'সুনামগঞ্জ', 'Sylhet'),
  ('Rangpur', 'রংপুর', 'Rangpur'),
  ('Dinajpur', 'দিনাজপুর', 'Rangpur'),
  ('Gaibandha', 'গাইবান্ধা', 'Rangpur'),
  ('Kurigram', 'কুড়িগ্রাম', 'Rangpur'),
  ('Lalmonirhat', 'লালমনিরহাট', 'Rangpur'),
  ('Nilphamari', 'নীলফামারী', 'Rangpur'),
  ('Panchagarh', 'পঞ্চগড়', 'Rangpur'),
  ('Thakurgaon', 'ঠাকুরগাঁও', 'Rangpur'),
  ('Mymensingh', 'ময়মনসিংহ', 'Mymensingh'),
  ('Jamalpur', 'জামালপুর', 'Mymensingh'),
  ('Netrokona', 'নেত্রকোণা', 'Mymensingh'),
  ('Sherpur', 'শেরপুর', 'Mymensingh');

-- Now seed upazilas for each district using a DO block
DO $$
DECLARE
  did uuid;
BEGIN
  -- Dhaka
  SELECT id INTO did FROM districts WHERE name='Dhaka' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Dhamrai', 'ধামরাই'), (did, 'Dohar', 'দোহার'), (did, 'Keraniganj', 'কেরানীগঞ্জ'),
    (did, 'Nawabganj', 'নবাবগঞ্জ'), (did, 'Savar', 'সাভার'), (did, 'Tejgaon', 'তেজগাঁও'),
    (did, 'Gulshan', 'গুলশান'), (did, 'Mirpur', 'মিরপুর'), (did, 'Mohammadpur', 'মোহাম্মদপুর'),
    (did, 'Uttara', 'উত্তরা'), (did, 'Motijheel', 'মতিঝিল'), (did, 'Ramna', 'রমনা'),
    (did, 'Lalbagh', 'লালবাগ'), (did, 'Dhanmondi', 'ধানমন্ডি'), (did, 'Wari', 'ওয়ারী');

  -- Gazipur
  SELECT id INTO did FROM districts WHERE name='Gazipur' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Gazipur Sadar', 'গাজীপুর সদর'), (did, 'Kaliakair', 'কালিয়াকৈর'),
    (did, 'Kaliganj', 'কালীগঞ্জ'), (did, 'Kapasia', 'কাপাসিয়া'), (did, 'Sreepur', 'শ্রীপুর');

  -- Narayanganj
  SELECT id INTO did FROM districts WHERE name='Narayanganj' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Araihazar', 'আড়াইহাজার'), (did, 'Bandar', 'বন্দর'),
    (did, 'Narayanganj Sadar', 'নারায়ণগঞ্জ সদর'), (did, 'Rupganj', 'রূপগঞ্জ'), (did, 'Sonargaon', 'সোনারগাঁও');

  -- Narsingdi
  SELECT id INTO did FROM districts WHERE name='Narsingdi' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Belabo', 'বেলাবো'), (did, 'Monohardi', 'মনোহরদী'),
    (did, 'Narsingdi Sadar', 'নরসিংদী সদর'), (did, 'Palash', 'পলাশ'),
    (did, 'Raipura', 'রায়পুরা'), (did, 'Shibpur', 'শিবপুর');

  -- Tangail
  SELECT id INTO did FROM districts WHERE name='Tangail' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Basail', 'বাসাইল'), (did, 'Bhuapur', 'ভুয়াপুর'), (did, 'Delduar', 'দেলদুয়ার'),
    (did, 'Dhanbari', 'ধনবাড়ী'), (did, 'Ghatail', 'ঘাটাইল'), (did, 'Gopalpur', 'গোপালপুর'),
    (did, 'Kalihati', 'কালিহাতি'), (did, 'Madhupur', 'মধুপুর'), (did, 'Mirzapur', 'মির্জাপুর'),
    (did, 'Nagarpur', 'নাগরপুর'), (did, 'Sakhipur', 'সখিপুর'), (did, 'Tangail Sadar', 'টাঙ্গাইল সদর');

  -- Kishoreganj
  SELECT id INTO did FROM districts WHERE name='Kishoreganj' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Austagram', 'অষ্টগ্রাম'), (did, 'Bajitpur', 'বাজিতপুর'), (did, 'Bhairab', 'ভৈরব'),
    (did, 'Hossainpur', 'হোসেনপুর'), (did, 'Itna', 'ইটনা'), (did, 'Karimganj', 'করিমগঞ্জ'),
    (did, 'Katiadi', 'কটিয়াদী'), (did, 'Kishoreganj Sadar', 'কিশোরগঞ্জ সদর'),
    (did, 'Kuliarchar', 'কুলিয়ারচর'), (did, 'Mithamain', 'মিঠামইন'),
    (did, 'Nikli', 'নিকলী'), (did, 'Pakundia', 'পাকুন্দিয়া'), (did, 'Tarail', 'তাড়াইল');

  -- Manikganj
  SELECT id INTO did FROM districts WHERE name='Manikganj' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Daulatpur', 'দৌলতপুর'), (did, 'Ghior', 'ঘিওর'), (did, 'Harirampur', 'হরিরামপুর'),
    (did, 'Manikganj Sadar', 'মানিকগঞ্জ সদর'), (did, 'Saturia', 'সাটুরিয়া'),
    (did, 'Shivalaya', 'শিবালয়'), (did, 'Singair', 'সিংগাইর');

  -- Munshiganj
  SELECT id INTO did FROM districts WHERE name='Munshiganj' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Gazaria', 'গজারিয়া'), (did, 'Lohajang', 'লৌহজং'),
    (did, 'Munshiganj Sadar', 'মুন্সীগঞ্জ সদর'), (did, 'Sirajdikhan', 'সিরাজদিখান'),
    (did, 'Sreenagar', 'শ্রীনগর'), (did, 'Tongibari', 'টংগীবাড়ী');

  -- Faridpur
  SELECT id INTO did FROM districts WHERE name='Faridpur' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Alfadanga', 'আলফাডাঙ্গা'), (did, 'Bhanga', 'ভাঙ্গা'), (did, 'Boalmari', 'বোয়ালমারী'),
    (did, 'Charbhadrasan', 'চরভদ্রাসন'), (did, 'Faridpur Sadar', 'ফরিদপুর সদর'),
    (did, 'Madhukhali', 'মধুখালী'), (did, 'Nagarkanda', 'নগরকান্দা'),
    (did, 'Sadarpur', 'সদরপুর'), (did, 'Saltha', 'সালথা');

  -- Gopalganj
  SELECT id INTO did FROM districts WHERE name='Gopalganj' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Gopalganj Sadar', 'গোপালগঞ্জ সদর'), (did, 'Kashiani', 'কাশিয়ানী'),
    (did, 'Kotalipara', 'কোটালীপাড়া'), (did, 'Muksudpur', 'মুকসুদপুর'), (did, 'Tungipara', 'টুংগীপাড়া');

  -- Madaripur
  SELECT id INTO did FROM districts WHERE name='Madaripur' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Kalkini', 'কালকিনি'), (did, 'Madaripur Sadar', 'মাদারীপুর সদর'),
    (did, 'Rajoir', 'রাজৈর'), (did, 'Shibchar', 'শিবচর');

  -- Rajbari
  SELECT id INTO did FROM districts WHERE name='Rajbari' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Baliakandi', 'বালিয়াকান্দি'), (did, 'Goalandaghat', 'গোয়ালন্দঘাট'),
    (did, 'Kalukhali', 'কালুখালী'), (did, 'Pangsha', 'পাংশা'), (did, 'Rajbari Sadar', 'রাজবাড়ী সদর');

  -- Shariatpur
  SELECT id INTO did FROM districts WHERE name='Shariatpur' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Bhedarganj', 'ভেদরগঞ্জ'), (did, 'Damudya', 'ডামুড্যা'), (did, 'Gosairhat', 'গোসাইরহাট'),
    (did, 'Naria', 'নড়িয়া'), (did, 'Shariatpur Sadar', 'শরীয়তপুর সদর'), (did, 'Zajira', 'জাজিরা');

  -- Chittagong
  SELECT id INTO did FROM districts WHERE name='Chittagong' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Anwara', 'আনোয়ারা'), (did, 'Banshkhali', 'বাঁশখালী'), (did, 'Boalkhali', 'বোয়ালখালী'),
    (did, 'Chandanaish', 'চন্দনাইশ'), (did, 'Fatikchhari', 'ফটিকছড়ি'), (did, 'Hathazari', 'হাটহাজারী'),
    (did, 'Lohagara', 'লোহাগাড়া'), (did, 'Mirsharai', 'মীরসরাই'), (did, 'Patiya', 'পটিয়া'),
    (did, 'Rangunia', 'রাঙ্গুনিয়া'), (did, 'Raozan', 'রাউজান'), (did, 'Sandwip', 'সন্দ্বীপ'),
    (did, 'Satkania', 'সাতকানিয়া'), (did, 'Sitakunda', 'সীতাকুন্ড');

  -- Comilla
  SELECT id INTO did FROM districts WHERE name='Comilla' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Barura', 'বরুড়া'), (did, 'Brahmanpara', 'ব্রাহ্মণপাড়া'), (did, 'Burichang', 'বুড়িচং'),
    (did, 'Chandina', 'চান্দিনা'), (did, 'Chauddagram', 'চৌদ্দগ্রাম'), (did, 'Comilla Sadar', 'কুমিল্লা সদর'),
    (did, 'Daudkandi', 'দাউদকান্দি'), (did, 'Debidwar', 'দেবিদ্বার'), (did, 'Homna', 'হোমনা'),
    (did, 'Laksam', 'লাকসাম'), (did, 'Meghna', 'মেঘনা'), (did, 'Monohorgonj', 'মনোহরগঞ্জ'),
    (did, 'Muradnagar', 'মুরাদনগর'), (did, 'Nangalkot', 'নাঙ্গলকোট'), (did, 'Titas', 'তিতাস');

  -- Coxs Bazar
  SELECT id INTO did FROM districts WHERE name='Coxs Bazar' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Chakaria', 'চকরিয়া'), (did, 'Coxs Bazar Sadar', 'কক্সবাজার সদর'),
    (did, 'Kutubdia', 'কুতুবদিয়া'), (did, 'Maheshkhali', 'মহেশখালী'),
    (did, 'Pekua', 'পেকুয়া'), (did, 'Ramu', 'রামু'),
    (did, 'Teknaf', 'টেকনাফ'), (did, 'Ukhia', 'উখিয়া');

  -- Brahmanbaria
  SELECT id INTO did FROM districts WHERE name='Brahmanbaria' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Akhaura', 'আখাউড়া'), (did, 'Bancharampur', 'বাঞ্ছারামপুর'),
    (did, 'Brahmanbaria Sadar', 'ব্রাহ্মণবাড়িয়া সদর'), (did, 'Kasba', 'কসবা'),
    (did, 'Nabinagar', 'নবীনগর'), (did, 'Nasirnagar', 'নাসিরনগর'),
    (did, 'Sarail', 'সরাইল'), (did, 'Ashuganj', 'আশুগঞ্জ'), (did, 'Bijoynagar', 'বিজয়নগর');

  -- Chandpur
  SELECT id INTO did FROM districts WHERE name='Chandpur' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Chandpur Sadar', 'চাঁদপুর সদর'), (did, 'Faridganj', 'ফরিদগঞ্জ'),
    (did, 'Haimchar', 'হাইমচর'), (did, 'Haziganj', 'হাজীগঞ্জ'),
    (did, 'Kachua', 'কচুয়া'), (did, 'Matlab Dakshin', 'মতলব দক্ষিণ'),
    (did, 'Matlab Uttar', 'মতলব উত্তর'), (did, 'Shahrasti', 'শাহরাস্তি');

  -- Feni
  SELECT id INTO did FROM districts WHERE name='Feni' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Chhagalnaiya', 'ছাগলনাইয়া'), (did, 'Daganbhuiyan', 'দাগনভূঞা'),
    (did, 'Feni Sadar', 'ফেনী সদর'), (did, 'Fulgazi', 'ফুলগাজী'),
    (did, 'Parshuram', 'পরশুরাম'), (did, 'Sonagazi', 'সোনাগাজী');

  -- Noakhali
  SELECT id INTO did FROM districts WHERE name='Noakhali' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Begumganj', 'বেগমগঞ্জ'), (did, 'Chatkhil', 'চাটখিল'),
    (did, 'Companiganj', 'কোম্পানীগঞ্জ'), (did, 'Hatiya', 'হাতিয়া'),
    (did, 'Kabirhat', 'কবিরহাট'), (did, 'Noakhali Sadar', 'নোয়াখালী সদর'),
    (did, 'Senbagh', 'সেনবাগ'), (did, 'Sonaimuri', 'সোনাইমুড়ী'), (did, 'Subarnachar', 'সুবর্ণচর');

  -- Lakshmipur
  SELECT id INTO did FROM districts WHERE name='Lakshmipur' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Kamalnagar', 'কমলনগর'), (did, 'Lakshmipur Sadar', 'লক্ষ্মীপুর সদর'),
    (did, 'Raipur', 'রায়পুর'), (did, 'Ramganj', 'রামগঞ্জ'), (did, 'Ramgati', 'রামগতি');

  -- Bandarban
  SELECT id INTO did FROM districts WHERE name='Bandarban' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Ali Kadam', 'আলীকদম'), (did, 'Bandarban Sadar', 'বান্দরবান সদর'),
    (did, 'Lama', 'লামা'), (did, 'Naikhongchhari', 'নাইক্ষ্যংছড়ি'),
    (did, 'Rowangchhari', 'রোয়াংছড়ি'), (did, 'Ruma', 'রুমা'), (did, 'Thanchi', 'থানচি');

  -- Khagrachhari
  SELECT id INTO did FROM districts WHERE name='Khagrachhari' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Dighinala', 'দিঘীনালা'), (did, 'Khagrachhari Sadar', 'খাগড়াছড়ি সদর'),
    (did, 'Lakshmichhari', 'লক্ষ্মীছড়ি'), (did, 'Mahalchhari', 'মহালছড়ি'),
    (did, 'Manikchhari', 'মানিকছড়ি'), (did, 'Matiranga', 'মাটিরাঙ্গা'),
    (did, 'Panchhari', 'পানছড়ি'), (did, 'Ramgarh', 'রামগড়');

  -- Rangamati
  SELECT id INTO did FROM districts WHERE name='Rangamati' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Bagaichhari', 'বাঘাইছড়ি'), (did, 'Barkal', 'বরকল'),
    (did, 'Belaichhari', 'বিলাইছড়ি'), (did, 'Juraichhari', 'জুরাছড়ি'),
    (did, 'Kaptai', 'কাপ্তাই'), (did, 'Kawkhali', 'কাউখালী'),
    (did, 'Langadu', 'লংগদু'), (did, 'Naniarchar', 'নানিয়ারচর'),
    (did, 'Rajasthali', 'রাজস্থলী'), (did, 'Rangamati Sadar', 'রাঙ্গামাটি সদর');

  -- Rajshahi
  SELECT id INTO did FROM districts WHERE name='Rajshahi' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Bagha', 'বাঘা'), (did, 'Bagmara', 'বাগমারা'), (did, 'Charghat', 'চারঘাট'),
    (did, 'Durgapur', 'দুর্গাপুর'), (did, 'Godagari', 'গোদাগাড়ী'),
    (did, 'Mohanpur', 'মোহনপুর'), (did, 'Paba', 'পবা'), (did, 'Puthia', 'পুঠিয়া'),
    (did, 'Tanore', 'তানোর');

  -- Bogra
  SELECT id INTO did FROM districts WHERE name='Bogra' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Adamdighi', 'আদমদীঘি'), (did, 'Bogra Sadar', 'বগুড়া সদর'),
    (did, 'Dhunat', 'ধুনট'), (did, 'Dhupchanchia', 'দুপচাঁচিয়া'),
    (did, 'Gabtali', 'গাবতলী'), (did, 'Kahaloo', 'কাহালু'),
    (did, 'Nandigram', 'নন্দীগ্রাম'), (did, 'Sariakandi', 'সারিয়াকান্দি'),
    (did, 'Shajahanpur', 'শাজাহানপুর'), (did, 'Sherpur', 'শেরপুর'),
    (did, 'Shibganj', 'শিবগঞ্জ'), (did, 'Sonatola', 'সোনাতলা');

  -- Chapainawabganj
  SELECT id INTO did FROM districts WHERE name='Chapainawabganj' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Bholahat', 'ভোলাহাট'), (did, 'Chapainawabganj Sadar', 'চাঁপাইনবাবগঞ্জ সদর'),
    (did, 'Gomastapur', 'গোমস্তাপুর'), (did, 'Nachole', 'নাচোল'), (did, 'Shibganj', 'শিবগঞ্জ');

  -- Naogaon
  SELECT id INTO did FROM districts WHERE name='Naogaon' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Atrai', 'আত্রাই'), (did, 'Badalgachhi', 'বদলগাছী'), (did, 'Dhamoirhat', 'ধামইরহাট'),
    (did, 'Manda', 'মান্দা'), (did, 'Mahadebpur', 'মহাদেবপুর'), (did, 'Naogaon Sadar', 'নওগাঁ সদর'),
    (did, 'Niamatpur', 'নিয়ামতপুর'), (did, 'Patnitala', 'পত্নীতলা'),
    (did, 'Porsha', 'পোরশা'), (did, 'Raninagar', 'রানীনগর'), (did, 'Sapahar', 'সাপাহার');

  -- Natore
  SELECT id INTO did FROM districts WHERE name='Natore' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Bagatipara', 'বাগাতিপাড়া'), (did, 'Baraigram', 'বড়াইগ্রাম'),
    (did, 'Gurudaspur', 'গুরুদাসপুর'), (did, 'Lalpur', 'লালপুর'),
    (did, 'Natore Sadar', 'নাটোর সদর'), (did, 'Singra', 'সিংড়া');

  -- Joypurhat
  SELECT id INTO did FROM districts WHERE name='Joypurhat' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Akkelpur', 'আক্কেলপুর'), (did, 'Joypurhat Sadar', 'জয়পুরহাট সদর'),
    (did, 'Kalai', 'কালাই'), (did, 'Khetlal', 'ক্ষেতলাল'), (did, 'Panchbibi', 'পাঁচবিবি');

  -- Nawabganj
  SELECT id INTO did FROM districts WHERE name='Nawabganj' LIMIT 1;
  IF did IS NOT NULL THEN
    INSERT INTO upazilas (district_id, name, name_bn) VALUES
      (did, 'Bholahat', 'ভোলাহাট'), (did, 'Gomastapur', 'গোমস্তাপুর'),
      (did, 'Nachole', 'নাচোল'), (did, 'Nawabganj Sadar', 'নবাবগঞ্জ সদর'), (did, 'Shibganj', 'শিবগঞ্জ');
  END IF;

  -- Pabna
  SELECT id INTO did FROM districts WHERE name='Pabna' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Atgharia', 'আটঘরিয়া'), (did, 'Bera', 'বেড়া'), (did, 'Bhangura', 'ভাঙ্গুড়া'),
    (did, 'Chatmohar', 'চাটমোহর'), (did, 'Faridpur', 'ফরিদপুর'), (did, 'Ishwardi', 'ঈশ্বরদী'),
    (did, 'Pabna Sadar', 'পাবনা সদর'), (did, 'Santhia', 'সাঁথিয়া'), (did, 'Sujanagar', 'সুজানগর');

  -- Sirajganj
  SELECT id INTO did FROM districts WHERE name='Sirajganj' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Belkuchi', 'বেলকুচি'), (did, 'Chauhali', 'চৌহালি'), (did, 'Kamarkhanda', 'কামারখন্দ'),
    (did, 'Kazipur', 'কাজীপুর'), (did, 'Raiganj', 'রায়গঞ্জ'), (did, 'Shahjadpur', 'শাহজাদপুর'),
    (did, 'Sirajganj Sadar', 'সিরাজগঞ্জ সদর'), (did, 'Tarash', 'তাড়াশ'), (did, 'Ullahpara', 'উল্লাপাড়া');

  -- Khulna
  SELECT id INTO did FROM districts WHERE name='Khulna' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Batiaghata', 'বটিয়াঘাটা'), (did, 'Dacope', 'দাকোপ'), (did, 'Dighalia', 'দিঘলিয়া'),
    (did, 'Dumuria', 'ডুমুরিয়া'), (did, 'Khalishpur', 'খালিশপুর'), (did, 'Khulna Sadar', 'খুলনা সদর'),
    (did, 'Koyra', 'কয়রা'), (did, 'Paikgachha', 'পাইকগাছা'), (did, 'Phultala', 'ফুলতলা'),
    (did, 'Rupsa', 'রূপসা'), (did, 'Terokhada', 'তেরখাদা');

  -- Bagerhat
  SELECT id INTO did FROM districts WHERE name='Bagerhat' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Bagerhat Sadar', 'বাগেরহাট সদর'), (did, 'Chitalmari', 'চিতলমারী'),
    (did, 'Fakirhat', 'ফকিরহাট'), (did, 'Kachua', 'কচুয়া'),
    (did, 'Mollahat', 'মোল্লাহাট'), (did, 'Mongla', 'মোংলা'),
    (did, 'Morrelganj', 'মোড়েলগঞ্জ'), (did, 'Rampal', 'রামপাল'), (did, 'Sarankhola', 'শরণখোলা');

  -- Jessore
  SELECT id INTO did FROM districts WHERE name='Jessore' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Abhaynagar', 'অভয়নগর'), (did, 'Bagherpara', 'বাঘারপাড়া'),
    (did, 'Chaugachha', 'চৌগাছা'), (did, 'Jessore Sadar', 'যশোর সদর'),
    (did, 'Jhikargachha', 'ঝিকরগাছা'), (did, 'Keshabpur', 'কেশবপুর'),
    (did, 'Manirampur', 'মণিরামপুর'), (did, 'Sharsha', 'শার্শা');

  -- Satkhira
  SELECT id INTO did FROM districts WHERE name='Satkhira' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Assasuni', 'আশাশুনি'), (did, 'Debhata', 'দেবহাটা'),
    (did, 'Kalaroa', 'কলারোয়া'), (did, 'Kaliganj', 'কালীগঞ্জ'),
    (did, 'Satkhira Sadar', 'সাতক্ষীরা সদর'), (did, 'Shyamnagar', 'শ্যামনগর'), (did, 'Tala', 'তালা');

  -- Jhenaidah
  SELECT id INTO did FROM districts WHERE name='Jhenaidah' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Harinakunda', 'হরিণাকুন্ডু'), (did, 'Jhenaidah Sadar', 'ঝিনাইদহ সদর'),
    (did, 'Kaliganj', 'কালীগঞ্জ'), (did, 'Kotchandpur', 'কোটচাঁদপুর'),
    (did, 'Maheshpur', 'মহেশপুর'), (did, 'Shailkupa', 'শৈলকুপা');

  -- Magura
  SELECT id INTO did FROM districts WHERE name='Magura' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Magura Sadar', 'মাগুরা সদর'), (did, 'Mohammadpur', 'মোহাম্মদপুর'),
    (did, 'Shalikha', 'শালিখা'), (did, 'Sreepur', 'শ্রীপুর');

  -- Narail
  SELECT id INTO did FROM districts WHERE name='Narail' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Kalia', 'কালিয়া'), (did, 'Lohagara', 'লোহাগড়া'), (did, 'Narail Sadar', 'নড়াইল সদর');

  -- Kushtia
  SELECT id INTO did FROM districts WHERE name='Kushtia' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Bheramara', 'ভেড়ামারা'), (did, 'Daulatpur', 'দৌলতপুর'),
    (did, 'Khoksa', 'খোকসা'), (did, 'Kumarkhali', 'কুমারখালী'),
    (did, 'Kushtia Sadar', 'কুষ্টিয়া সদর'), (did, 'Mirpur', 'মিরপুর');

  -- Chuadanga
  SELECT id INTO did FROM districts WHERE name='Chuadanga' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Alamdanga', 'আলমডাঙ্গা'), (did, 'Chuadanga Sadar', 'চুয়াডাঙ্গা সদর'),
    (did, 'Damurhuda', 'দামুড়হুদা'), (did, 'Jibannagar', 'জীবননগর');

  -- Meherpur
  SELECT id INTO did FROM districts WHERE name='Meherpur' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Gangni', 'গাংনী'), (did, 'Meherpur Sadar', 'মেহেরপুর সদর'), (did, 'Mujibnagar', 'মুজিবনগর');

  -- Barisal
  SELECT id INTO did FROM districts WHERE name='Barisal' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Agailjhara', 'আগৈলঝাড়া'), (did, 'Babuganj', 'বাবুগঞ্জ'), (did, 'Bakerganj', 'বাকেরগঞ্জ'),
    (did, 'Banaripara', 'বানারীপাড়া'), (did, 'Barisal Sadar', 'বরিশাল সদর'),
    (did, 'Gaurnadi', 'গৌরনদী'), (did, 'Hizla', 'হিজলা'), (did, 'Mehendiganj', 'মেহেন্দিগঞ্জ'),
    (did, 'Muladi', 'মুলাদী'), (did, 'Wazirpur', 'উজিরপুর');

  -- Barguna
  SELECT id INTO did FROM districts WHERE name='Barguna' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Amtali', 'আমতলী'), (did, 'Bamna', 'বামনা'), (did, 'Barguna Sadar', 'বরগুনা সদর'),
    (did, 'Betagi', 'বেতাগী'), (did, 'Patharghata', 'পাথরঘাটা'), (did, 'Taltali', 'তালতলী');

  -- Bhola
  SELECT id INTO did FROM districts WHERE name='Bhola' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Bhola Sadar', 'ভোলা সদর'), (did, 'Borhanuddin', 'বোরহানউদ্দিন'),
    (did, 'Char Fasson', 'চরফ্যাশন'), (did, 'Daulatkhan', 'দৌলতখান'),
    (did, 'Lalmohan', 'লালমোহন'), (did, 'Manpura', 'মনপুরা'), (did, 'Tazumuddin', 'তজুমদ্দিন');

  -- Jhalokati
  SELECT id INTO did FROM districts WHERE name='Jhalokati' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Jhalokati Sadar', 'ঝালকাঠি সদর'), (did, 'Kathalia', 'কাঠালিয়া'),
    (did, 'Nalchity', 'নলছিটি'), (did, 'Rajapur', 'রাজাপুর');

  -- Patuakhali
  SELECT id INTO did FROM districts WHERE name='Patuakhali' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Bauphal', 'বাউফল'), (did, 'Dashmina', 'দশমিনা'), (did, 'Dumki', 'দুমকি'),
    (did, 'Galachipa', 'গলাচিপা'), (did, 'Kalapara', 'কলাপাড়া'),
    (did, 'Mirzaganj', 'মির্জাগঞ্জ'), (did, 'Patuakhali Sadar', 'পটুয়াখালী সদর'), (did, 'Rangabali', 'রাঙ্গাবালী');

  -- Pirojpur
  SELECT id INTO did FROM districts WHERE name='Pirojpur' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Bhandaria', 'ভান্ডারিয়া'), (did, 'Kawkhali', 'কাউখালী'),
    (did, 'Mathbaria', 'মঠবাড়িয়া'), (did, 'Nazirpur', 'নাজিরপুর'),
    (did, 'Nesarabad', 'নেছারাবাদ'), (did, 'Pirojpur Sadar', 'পিরোজপুর সদর'), (did, 'Zianagar', 'জিয়ানগর');

  -- Sylhet
  SELECT id INTO did FROM districts WHERE name='Sylhet' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Balaganj', 'বালাগঞ্জ'), (did, 'Beanibazar', 'বিয়ানীবাজার'),
    (did, 'Bishwanath', 'বিশ্বনাথ'), (did, 'Companiganj', 'কোম্পানীগঞ্জ'),
    (did, 'Fenchuganj', 'ফেঞ্চুগঞ্জ'), (did, 'Golapganj', 'গোলাপগঞ্জ'),
    (did, 'Gowainghat', 'গোয়াইনঘাট'), (did, 'Jaintiapur', 'জৈন্তাপুর'),
    (did, 'Kanaighat', 'কানাইঘাট'), (did, 'Osmani Nagar', 'ওসমানী নগর'),
    (did, 'South Surma', 'দক্ষিণ সুরমা'), (did, 'Sylhet Sadar', 'সিলেট সদর'), (did, 'Zakiganj', 'জকিগঞ্জ');

  -- Habiganj
  SELECT id INTO did FROM districts WHERE name='Habiganj' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Ajmiriganj', 'আজমিরীগঞ্জ'), (did, 'Bahubal', 'বাহুবল'),
    (did, 'Baniachong', 'বানিয়াচং'), (did, 'Chunarughat', 'চুনারুঘাট'),
    (did, 'Habiganj Sadar', 'হবিগঞ্জ সদর'), (did, 'Lakhai', 'লাখাই'),
    (did, 'Madhabpur', 'মাধবপুর'), (did, 'Nabiganj', 'নবীগঞ্জ');

  -- Moulvibazar
  SELECT id INTO did FROM districts WHERE name='Moulvibazar' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Barlekha', 'বড়লেখা'), (did, 'Juri', 'জুড়ী'),
    (did, 'Kamalganj', 'কমলগঞ্জ'), (did, 'Kulaura', 'কুলাউড়া'),
    (did, 'Moulvibazar Sadar', 'মৌলভীবাজার সদর'), (did, 'Rajnagar', 'রাজনগর'), (did, 'Sreemangal', 'শ্রীমঙ্গল');

  -- Sunamganj
  SELECT id INTO did FROM districts WHERE name='Sunamganj' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Bishwamvarpur', 'বিশ্বম্ভরপুর'), (did, 'Chhatak', 'ছাতক'),
    (did, 'Derai', 'দিরাই'), (did, 'Dharampasha', 'ধর্মপাশা'),
    (did, 'Dowarabazar', 'দোয়ারাবাজার'), (did, 'Jagannathpur', 'জগন্নাথপুর'),
    (did, 'Jamalganj', 'জামালগঞ্জ'), (did, 'Sulla', 'শাল্লা'),
    (did, 'Sunamganj Sadar', 'সুনামগঞ্জ সদর'), (did, 'Tahirpur', 'তাহিরপুর');

  -- Rangpur
  SELECT id INTO did FROM districts WHERE name='Rangpur' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Badarganj', 'বদরগঞ্জ'), (did, 'Gangachara', 'গঙ্গাচড়া'),
    (did, 'Kaunia', 'কাউনিয়া'), (did, 'Mithapukur', 'মিঠাপুকুর'),
    (did, 'Pirgachha', 'পীরগাছা'), (did, 'Pirganj', 'পীরগঞ্জ'),
    (did, 'Rangpur Sadar', 'রংপুর সদর'), (did, 'Taraganj', 'তারাগঞ্জ');

  -- Dinajpur
  SELECT id INTO did FROM districts WHERE name='Dinajpur' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Birampur', 'বীরামপুর'), (did, 'Birganj', 'বীরগঞ্জ'), (did, 'Biral', 'বিরল'),
    (did, 'Bochaganj', 'বোচাগঞ্জ'), (did, 'Chirirbandar', 'চিরিরবন্দর'),
    (did, 'Dinajpur Sadar', 'দিনাজপুর সদর'), (did, 'Fulbari', 'ফুলবাড়ী'),
    (did, 'Ghoraghat', 'ঘোড়াঘাট'), (did, 'Hakimpur', 'হাকিমপুর'),
    (did, 'Kaharole', 'কাহারোল'), (did, 'Khansama', 'খানসামা'),
    (did, 'Nawabganj', 'নবাবগঞ্জ'), (did, 'Parbatipur', 'পার্বতীপুর');

  -- Gaibandha
  SELECT id INTO did FROM districts WHERE name='Gaibandha' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Fulchhari', 'ফুলছড়ি'), (did, 'Gaibandha Sadar', 'গাইবান্ধা সদর'),
    (did, 'Gobindaganj', 'গোবিন্দগঞ্জ'), (did, 'Palashbari', 'পলাশবাড়ী'),
    (did, 'Sadullapur', 'সাদুল্লাপুর'), (did, 'Saghata', 'সাঘাটা'), (did, 'Sundarganj', 'সুন্দরগঞ্জ');

  -- Kurigram
  SELECT id INTO did FROM districts WHERE name='Kurigram' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Bhurungamari', 'ভূরুঙ্গামারী'), (did, 'Char Rajibpur', 'চর রাজিবপুর'),
    (did, 'Chilmari', 'চিলমারী'), (did, 'Kurigram Sadar', 'কুড়িগ্রাম সদর'),
    (did, 'Nageshwari', 'নাগেশ্বরী'), (did, 'Phulbari', 'ফুলবাড়ী'),
    (did, 'Rajarhat', 'রাজারহাট'), (did, 'Rowmari', 'রৌমারী'), (did, 'Ulipur', 'উলিপুর');

  -- Lalmonirhat
  SELECT id INTO did FROM districts WHERE name='Lalmonirhat' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Aditmari', 'আদিতমারী'), (did, 'Hatibandha', 'হাতীবান্ধা'),
    (did, 'Kaliganj', 'কালীগঞ্জ'), (did, 'Lalmonirhat Sadar', 'লালমনিরহাট সদর'), (did, 'Patgram', 'পাটগ্রাম');

  -- Nilphamari
  SELECT id INTO did FROM districts WHERE name='Nilphamari' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Dimla', 'ডিমলা'), (did, 'Domar', 'ডোমার'), (did, 'Jaldhaka', 'জলঢাকা'),
    (did, 'Kishoreganj', 'কিশোরগঞ্জ'), (did, 'Nilphamari Sadar', 'নীলফামারী সদর'), (did, 'Saidpur', 'সৈয়দপুর');

  -- Panchagarh
  SELECT id INTO did FROM districts WHERE name='Panchagarh' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Atwari', 'আটোয়ারী'), (did, 'Boda', 'বোদা'), (did, 'Debiganj', 'দেবীগঞ্জ'),
    (did, 'Panchagarh Sadar', 'পঞ্চগড় সদর'), (did, 'Tetulia', 'তেতুলিয়া');

  -- Thakurgaon
  SELECT id INTO did FROM districts WHERE name='Thakurgaon' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Baliadangi', 'বালিয়াডাঙ্গী'), (did, 'Haripur', 'হরিপুর'),
    (did, 'Pirganj', 'পীরগঞ্জ'), (did, 'Ranisankail', 'রাণীশংকৈল'), (did, 'Thakurgaon Sadar', 'ঠাকুরগাঁও সদর');

  -- Mymensingh
  SELECT id INTO did FROM districts WHERE name='Mymensingh' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Bhaluka', 'ভালুকা'), (did, 'Dhobaura', 'ধোবাউড়া'), (did, 'Fulbaria', 'ফুলবাড়িয়া'),
    (did, 'Gaffargaon', 'গফরগাঁও'), (did, 'Gauripur', 'গৌরীপুর'), (did, 'Haluaghat', 'হালুয়াঘাট'),
    (did, 'Ishwarganj', 'ঈশ্বরগঞ্জ'), (did, 'Muktagachha', 'মুক্তাগাছা'),
    (did, 'Mymensingh Sadar', 'ময়মনসিংহ সদর'), (did, 'Nandail', 'নান্দাইল'),
    (did, 'Phulpur', 'ফুলপুর'), (did, 'Trishal', 'ত্রিশাল'), (did, 'Tarakanda', 'তারাকান্দা');

  -- Jamalpur
  SELECT id INTO did FROM districts WHERE name='Jamalpur' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Bakshiganj', 'বকশীগঞ্জ'), (did, 'Dewanganj', 'দেওয়ানগঞ্জ'),
    (did, 'Islampur', 'ইসলামপুর'), (did, 'Jamalpur Sadar', 'জামালপুর সদর'),
    (did, 'Madarganj', 'মাদারগঞ্জ'), (did, 'Melandaha', 'মেলান্দহ'), (did, 'Sarishabari', 'সরিষাবাড়ী');

  -- Netrokona
  SELECT id INTO did FROM districts WHERE name='Netrokona' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Atpara', 'আটপাড়া'), (did, 'Barhatta', 'বারহাট্টা'), (did, 'Durgapur', 'দুর্গাপুর'),
    (did, 'Kalmakanda', 'কলমাকান্দা'), (did, 'Kendua', 'কেন্দুয়া'), (did, 'Khaliajuri', 'খালিয়াজুরী'),
    (did, 'Madan', 'মদন'), (did, 'Mohanganj', 'মোহনগঞ্জ'),
    (did, 'Netrokona Sadar', 'নেত্রকোণা সদর'), (did, 'Purbadhala', 'পূর্বধলা');

  -- Sherpur
  SELECT id INTO did FROM districts WHERE name='Sherpur' LIMIT 1;
  INSERT INTO upazilas (district_id, name, name_bn) VALUES
    (did, 'Jhenaigati', 'ঝিনাইগাতী'), (did, 'Nakla', 'নকলা'),
    (did, 'Nalitabari', 'নালিতাবাড়ী'), (did, 'Sherpur Sadar', 'শেরপুর সদর'), (did, 'Sreebardi', 'শ্রীবরদী');
END $$;

NOTIFY pgrst, 'reload schema';
