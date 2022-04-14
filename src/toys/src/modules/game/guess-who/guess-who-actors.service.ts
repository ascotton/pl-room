const images = [
    'af_a_h_e_a0.svg',
    'af_a_h_e_a1.svg',
    'af_a_h_e_a13.svg',
    'af_a_h_e_a2.svg',
    'af_a_h_e_a23.svg',
    'af_a_h_e_a3.svg',
    'af_b_h_e_a0.svg',
    'af_b_h_e_a1.svg',
    'af_b_h_e_a13.svg',
    'af_b_h_e_a2.svg',
    'af_b_h_e_a23.svg',
    'af_b_h_e_a3.svg',
    'af_c_hbld_ebl_a0.svg',
    'af_c_hbld_ebl_a1.svg',
    'af_c_hbld_ebl_a13.svg',
    'af_c_hbld_ebl_a2.svg',
    'af_c_hbld_ebl_a23.svg',
    'af_c_hbld_ebl_a3.svg',
    'af_c_hbld_ebn_a0.svg',
    'af_c_hbld_ebn_a1.svg',
    'af_c_hbld_ebn_a13.svg',
    'af_c_hbld_ebn_a2.svg',
    'af_c_hbld_ebn_a23.svg',
    'af_c_hbld_ebn_a3.svg',
    'af_c_hbld_eg_a0.svg',
    'af_c_hbld_eg_a1.svg',
    'af_c_hbld_eg_a12.svg',
    'af_c_hbld_eg_a13.svg',
    'af_c_hbld_eg_a2.svg',
    'af_c_hbld_eg_a23.svg',
    'af_c_hbld_eg_a3.svg',
    'af_c_hbld_eg_a3_O.svg',
    'af_c_hblk_ebl_a0.svg',
    'af_c_hblk_ebl_a1.svg',
    'af_c_hblk_ebl_a13.svg',
    'af_c_hblk_ebl_a2.svg',
    'af_c_hblk_ebl_a23.svg',
    'af_c_hblk_ebl_a3.svg',
    'af_c_hblk_ebn_a0.svg',
    'af_c_hblk_ebn_a1.svg',
    'af_c_hblk_ebn_a13.svg',
    'af_c_hblk_ebn_a2.svg',
    'af_c_hblk_ebn_a23.svg',
    'af_c_hblk_ebn_a3.svg',
    'af_c_hblk_eg_a0.svg',
    'af_c_hblk_eg_a1.svg',
    'af_c_hblk_eg_a13.svg',
    'af_c_hblk_eg_a2.svg',
    'af_c_hblk_eg_a23.svg',
    'af_c_hblk_eg_a3.svg',
    'af_c_hbn_ebl_a0.svg',
    'af_c_hbn_ebl_a1.svg',
    'af_c_hbn_ebl_a13.svg',
    'af_c_hbn_ebl_a2.svg',
    'af_c_hbn_ebl_a23.svg',
    'af_c_hbn_ebl_a3.svg',
    'af_c_hbn_ebn_a0.svg',
    'af_c_hbn_ebn_a1.svg',
    'af_c_hbn_ebn_a13.svg',
    'af_c_hbn_ebn_a2.svg',
    'af_c_hbn_ebn_a23.svg',
    'af_c_hbn_ebn_a3.svg',
    'af_c_hbn_eg_a0.svg',
    'af_c_hbn_eg_a1.svg',
    'af_c_hbn_eg_a13.svg',
    'af_c_hbn_eg_a2.svg',
    'af_c_hbn_eg_a23.svg',
    'af_c_hbn_eg_a3.svg',
    'af_c_hrd_ebl_a0.svg',
    'af_c_hrd_ebl_a1.svg',
    'af_c_hrd_ebl_a13.svg',
    'af_c_hrd_ebl_a2.svg',
    'af_c_hrd_ebl_a23.svg',
    'af_c_hrd_ebl_a3.svg',
    'af_c_hrd_ebn_a0.svg',
    'af_c_hrd_ebn_a1.svg',
    'af_c_hrd_ebn_a13.svg',
    'af_c_hrd_ebn_a2.svg',
    'af_c_hrd_ebn_a23.svg',
    'af_c_hrd_ebn_a3.svg',
    'af_c_hrd_eg_a0.svg',
    'af_c_hrd_eg_a1.svg',
    'af_c_hrd_eg_a13.svg',
    'af_c_hrd_eg_a2.svg',
    'af_c_hrd_eg_a23.svg',
    'af_c_hrd_eg_a3.svg',
    'af_h_h_e_a0.svg',
    'af_h_h_e_a1.svg',
    'af_h_h_e_a13.svg',
    'af_h_h_e_a2.svg',
    'af_h_h_e_a23.svg',
    'af_h_h_e_a3.svg',
    'am_a_h_e_a0.svg',
    'am_a_hbald_e_a0.svg',
    'am_a_hgoat_e_a0.svg',
    'am_a_hmstache_e_a0.svg',
    'am_a_hmstache_e_a1.svg',
    'am_a_hmstache_e_a2.svg',
    'am_a_hmstache_e_a3.svg',
    'am_a_hmstache_e_a4.svg',
    'am_b_h_e_a0.svg',
    'am_b_h_e_a1.svg',
    'am_b_hb_e_a0.svg',
    'am_b_hb_e_a1.svg',
    'am_b_hb_e_a3.svg',
    'am_b_hbeard_e_a0.svg',
    'am_b_hbeard_e_a1.svg',
    'am_b_hbeard_e_a3.svg',
    'am_b_hmstache_e_a0.svg',
    'am_b_hmstache_e_a1.svg',
    'am_b_hmstache_e_a3.svg',
    'am_c_hbld_ebl_a2.svg',
    'am_c_hbld_ebl_a3.svg',
    'am_c_hbld_ebl_a4.svg',
    'am_c_hbld_eg_a0.svg',
    'am_c_hbld_eg_a1.svg',
    'am_c_hbld_eg_a2.svg',
    'am_c_hbld_eg_a3.svg',
    'am_c_hbld_eg_a4.svg',
    'am_c_hblk_ebl_a0.svg',
    'am_c_hblk_ebl_a2.svg',
    'am_c_hblk_ebl_a3.svg',
    'am_c_hblk_ebl_a4.svg',
    'am_c_hblk_eg_a0.svg',
    'am_c_hblk_eg_a1.svg',
    'am_c_hblk_eg_a2.svg',
    'am_c_hblk_eg_a3.svg',
    'am_c_hblk_eg_a4.svg',
    'am_c_hbn_ebl_a0.svg',
    'am_c_hbn_ebl_a2.svg',
    'am_c_hbn_ebl_a3.svg',
    'am_c_hbn_ebl_a4.svg',
    'am_c_hbn_eg_a0.svg',
    'am_c_hbn_eg_a1.svg',
    'am_c_hbn_eg_a2.svg',
    'am_c_hbn_eg_a3.svg',
    'am_c_hbn_eg_a4.svg',
    'am_c_hrd_eg_a0.svg',
    'am_c_hrd_eg_a1.svg',
    'am_c_hrd_eg_a2.svg',
    'am_c_hrd_eg_a3.svg',
    'am_c_hrd_eg_a4.svg',
    'am_h_hbaldgoat_e_a0.svg',
    'am_h_hbaldgoat_e_a1.svg',
    'am_h_hgoat_e_a3.svg',
    'am_h_hmstache_e_a0.svg',
    'am_h_hmstache_e_a1.svg',
    'am_h_hmstache_e_a3.svg',
    'am_h_hmstache_e_a4.svg',
    'cf_a_h_e_a0.svg',
    'cf_a_h_e_a1.svg',
    'cf_a_h_e_a2.svg',
    'cf_a_h_e_a3.svg',
    'cf_a_h_e_a4.svg',
    'cf_b_h_e_a0.svg',
    'cf_b_h_e_a1.svg',
    'cf_b_h_e_a2.svg',
    'cf_b_h_e_a3.svg',
    'cf_b_h_e_a4.svg',
    'cf_c_hbld_ebl_a1.svg',
    'cf_c_hbld_ebl_a2.svg',
    'cf_c_hbld_ebl_a3.svg',
    'cf_c_hbld_ebl_a4.svg',
    'cf_c_hbld_ebn_a2.svg',
    'cf_c_hblk_eb_a0.svg',
    'cf_c_hblk_eb_a1.svg',
    'cf_c_hblk_eb_a2.svg',
    'cf_c_hblk_eb_a3.svg',
    'cf_c_hblk_eb_a4.svg',
    'cf_c_hblk_eg_a0.svg',
    'cf_c_hblk_eg_a2.svg',
    'cf_c_hblk_eg_a3.svg',
    'cf_c_hblk_eg_a4.svg',
    'cf_c_hrd_ebr_a0.svg',
    'cf_c_hrd_ebr_a1.svg',
    'cf_c_hrd_ebr_a2.svg',
    'cf_c_hrd_eg_a0.svg',
    'cf_c_hrd_eg_a4.svg',
    'cf_h_h_e_a0.svg',
    'cf_h_h_e_a1.svg',
    'cf_h_h_e_a2.svg',
    'cf_h_h_e_a3.svg',
    'cf_h_h_e_a4.svg',
    'cm_a_h_e_a0.svg',
    'cm_a_h_e_a1.svg',
    'cm_a_h_e_a2.svg',
    'cm_a_h_e_a3.svg',
    'cm_b_h_e_a0.svg',
    'cm_b_h_e_a1.svg',
    'cm_b_h_e_a2.svg',
    'cm_b_h_e_a3.svg',
    'cm_c_hblk_ebl_a0.svg',
    'cm_c_hblk_ebn_a0.svg',
    'cm_c_hblk_ebn_a2.svg',
    'cm_c_hblk_ebn_a3.svg',
    'cm_c_hblk_eg_a0.svg',
    'cm_c_hbn_ebn_a1.svg',
    'cm_c_hbn_ebn_a2.svg',
    'cm_c_hbn_ebn_a3.svg',
    'cm_c_hrd_ebn_a0.svg',
    'cm_c_hrd_ebn_a2.svg',
    'cm_c_hrd_ebn_a3.svg',
    'cm_c_hrd_eg_a0.svg',
    'cm_c_hrd_eg_a2.svg',
    'cm_c_hrd_eg_a3.svg',
    'cm_h_h_e_a0.svg',
    'cm_h_h_e_a1.svg',
    'cm_h_h_e_a2.svg',
    'cm_h_h_e_a3.svg',
    'sm_a_hnolickbeard_e_a0.svg',
    'sm_a_hnolickbeard_e_a1.svg',
    'sm_a_hnolickbeard_e_a2.svg',
    'sm_a_hnolickbeard_e_a3.svg',
    'sm_a_hnolickstache_e_a13.svg',
    'sm_a_hnolickstache_e_a3.svg',
    'sm_b_hbeard_e_a0.svg',
    'sm_b_hnolickbeard_e_a0.svg',
    'sm_b_hnolickbeard_e_a12.svg',
    'sm_b_hnolickstache_e_a0.svg',
    'sm_b_hnolickstache_e_a12.svg',
    'sm_b_hnolickstache_e_a3.svg',
    'sm_c_hlick_ebr_a0.svg',
    'sm_c_hlick_ebr_a12.svg',
    'sm_c_hlick_ebr_a2.svg',
    'sm_c_hlick_ebr_a3.svg',
    'sm_c_hlick_eg_a12.svg',
    'sm_c_hlickbeard_ebl_a2.svg',
    'sm_c_hlickbeard_eg_a12.svg',
    'sm_c_hlickstache_ebl_a1.svg',
    'sm_c_hlickstache_ebl_a13.svg',
    'sm_h_hlickbeard_e_a12.svg',
    'sm_h_hlickstache_e_a0.svg',
    'sm_h_hlickstache_e_a3.svg',
    'sw_a_h_e_a0.svg',
    'sw_a_h_e_a1.svg',
    'sw_a_h_e_a2.svg',
    'sw_a_h_e_a23.svg',
    'sw_a_h_e_a24.svg',
    'sw_a_h_e_a3.svg',
    'sw_a_h_e_a4.svg',
    'sw_b_h_e_a0.svg',
    'sw_b_h_e_a1.svg',
    'sw_b_h_e_a12.svg',
    'sw_b_h_e_a23.svg',
    'sw_b_h_e_a3.svg',
    'sw_b_h_e_a34.svg',
    'sw_b_h_e_a4.svg',
    'sw_c_h_ebl_a0.svg',
    'sw_c_h_ebl_a1.svg',
    'sw_c_h_ebl_a2.svg',
    'sw_c_h_ebl_a23.svg',
    'sw_c_h_ebl_a24.svg',
    'sw_c_h_ebl_a3.svg',
    'sw_c_h_ebl_a4.svg',
    'sw_c_h_ebr_a0.svg',
    'sw_c_h_ebr_a1.svg',
    'sw_c_h_ebr_a12.svg',
    'sw_c_h_ebr_a2.svg',
    'sw_c_h_ebr_a23.svg',
    'sw_c_h_ebr_a24.svg',
    'sw_c_h_ebr_a3.svg',
    'sw_c_h_ebr_a4.svg',
    'sw_c_h_eg_a0.svg',
    'sw_c_h_eg_a12.svg',
    'sw_c_h_eg_a24.svg',
    'sw_c_h_eg_a3.svg',
    'sw_c_h_eg_a4.svg',
    'sw_h_h_e_a0.svg',
    'sw_h_h_e_a1.svg',
    'sw_h_h_e_a2.svg',
    'sw_h_h_e_a23.svg',
    'sw_h_h_e_a24.svg',
    'sw_h_h_e_a4.svg',
];

const maleNames = [
    'Clarence',
    'Joey',
    'Keneth',
    'Josiah',
    'Michael',
    'Brett',
    'Aaron',
    'Nathaniel',
    'Elmer',
    'Andre',
    'Harvey',
    'Jared',
    'Tyrone',
    'Kurt',
    'Nelson',
    'Blane',
    'Armando',
    'Dwight',
    'Jordan',
    'Franklin',
    'Brewer',
    'Ivan',
    'Isaac',
    'Ross',
    'Ralph',
    'Kent',
    'Bruce',
    'Mendel',
    'Daniel',
    'Brody',
    'Charlie',
    'Marcel',
    'Sergio',
    'Donald',
    'Mark',
    'Kirk',
    'Philbert',
    'Felix',
    'Allister',
    'Hugh',
    'Joe',
    'Brian',
    'Edward',
    'Esteban',
    'Patrick',
    'Vin',
    'Jermayne',
    'Ron',
    'Paul',
    'Jimmy',
    'Claude',
    'Scott',
    'Greg',
    'Louis',
    'Josh',
    'Walter',
    'Dallas',
    'Willie',
    'Peter',
    'Harold',
    'Tyler',
    'Warner',
    'Chris',
    'Chester',
    'Sinclair',
    'Bowie',
    'Brit',
    'Chas',
    'Sam',
    'Carl',
    'Newton',
    'Sean',
    'Ernest',
    'Chandler',
    'Clement',
    'Royce',
    'Germaine',
    'Roy',
    'Channing',
    'Lee',
    'Hogan',
    'Conroy',
    'Mitchell',
    'Brandon',
    'Jude',
    'Ernst',
    'Duncan',
    'Graham',
    'Andrew',
    'Rupert',
    'Dermot',
    'Hubert',
    'Sampson',
    'Mateo',
    'Corbin',
    'Reggie',
    'Hiro',
    'Bayard',
    'Clay',
    'Jay',
    'Steve',
    'Demetrius',
    'Matthew',
    'Todd',
    'Seth',
    'William',
    'Justin',
    'Willis',
    'Arthur',
    'Arch',
    'Araldo',
    'Bob',
    'Booth',
    'Terrance',
    'Noah',
    'Rod',
    'Terry',
    'Raul',
    'Edgar',
    'Brod',
    'Rob',
    'Keith',
    'Nolan',
    'Carney',
    'Christian',
    'Whitaker',
    'Duane',
    'Daryl',
    'Antonius',
    'Giorgio',
    'Ted',
    'Paulie',
    'Neil',
    'Lamar',
    'Washington',
    'Lambert',
    'Tito',
    'Abe',
    'Felipe',
    'Ray',
    'Kieran',
    'Dewitt',
    'Dillie',
    'Rubin',
    'Robert',
    'Derrick',
    'Winston',
    'Norman',
    'Patty',
    'Vernon',
    'Broderick',
    'Gordon',
    'Warren',
    'Calvin',
    'Phil',
    'Gary',
    'Elroy',
    'Adam',
    'Timothy',
    'Tom',
    'Niles',
    'Gene',
    'Edwin',
    'Bradley',
    'Oscar',
    'Colin',
    'George',
    'Dennis',
    'Gunther',
    'Theo',
    'Clifford',
    'Fred',
    'Mario',
    'Allen',
    'Harry',
    'Alex',
    'Martin',
    'Randall',
    'Troy',
    'Kyle',
    'Douglas',
    'Travis',
    'Curt',
    'Vincent',
    'Ferdinand',
    'Curtis',
    'Rodriquez',
    'Malcolm',
    'Tony',
    'Victor',
    'Philip',
    'Earl',
];

const femaleNames = [
    'Faith',
    'Reese',
    'Sarah',
    'Corinne',
    'Susan',
    'Anne',
    'Joanna',
    'Barbara',
    'Nancy',
    'Grace',
    'Jennifer',
    'Juliet',
    'Rebecca',
    'Thea',
    'Kathy',
    'Linda',
    'Roxanna',
    'Maria',
    'Harriet',
    'Betty',
    'Chrissie',
    'Rosa',
    'Sonia',
    'Margaret',
    'Dorothy',
    'Madison',
    'Lauren',
    'Josie',
    'Augustina',
    'Lisa',
    'Genna',
    'Burnette',
    'Tiffany',
    'Ruth',
    'Crystal',
    'Michelle',
    'Viviana',
    'Abigail',
    'Rosie',
    'Florence',
    'Cora',
    'Julia',
    'Theresa',
    'Rachel',
    'Tammy',
    'Alice',
    'Sherry',
    'Carol',
    'Donna',
    'Shannon',
    'Tori',
    'Wendy',
    'Kelly',
    'Esther',
    'Candice',
    'Monica',
    'Catrina',
    'Megan',
    'Shirley',
    'Alicia',
    'Blanche',
    'Taylor',
    'Luna',
    'Bertha',
    'Elena',
    'Veronica',
    'April',
    'Audrey',
    'Isabella',
    'Stacy',
    'Anna',
    'Courtney',
    'Simone',
    'Elizabeth',
    'Norah',
    'Logan',
    'Ariel',
    'Harper',
    'Mila',
    'Molly',
    'Danielle',
    'Shelby',
    'Melody',
    'Benedetta',
    'Irene',
    'Naomi',
    'Guadalupe',
    'Katheryn',
    'Vicky',
    'Eden',
    'Melanie',
    'Haley',
    'Sophie',
    'Maya',
    'Danny',
    'Layla',
    'Caroline',
    'Andrea',
    'Lily',
    'Edith',
    'Cam',
    'Riley',
    'Sally',
    'Jessie',
    'Morgan',
    'Ashley',
    'Penny',
    'Joan',
    'Holly',
    'Gloria',
    'Joyce',
    'Mia',
    'Trudy',
    'Emily',
    'Cindy',
    'Paris',
    'Marilyn',
    'Beth',
    'Dory',
    'Martha',
    'Lucy',
    'Tiana',
    'Bella',
    'Victoria',
    'Emily',
    'Colette',
    'Daisy',
    'Joy',
    'Becky',
    'Helen',
    'Natalie',
    'Alexandra',
    'Gabriella',
    'Annie',
    'Wilma',
    'Valentina',
    'Olive',
    'Carina',
    'Diane',
    'Janet',
    'Kathleen',
    'Brenda',
    'Amanda',
    'Pamela',
];

const actors = {
    images,
    maleNames,
    femaleNames,
};

angular.module('toys').constant('guessWhoActors', actors);
