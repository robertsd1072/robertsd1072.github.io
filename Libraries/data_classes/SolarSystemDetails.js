class SolarSystemDetails
{
    constructor() {}

    #star = new Star([[1.0, 0.0, 0.0, 0.0],
                      [0.0, 1.0, 0.0, 0.0],
                      [0.0, 0.0, 1.0, 0.0],
                      [0.0, 0.0, 0.0, 1.0]], 2, [1, 0.95, 0.5, 1]);

    #planet_prof_skills = 
              new Planet
              (
          /*thing_about_me*/ "professional skills"
                     /*ctm*/,null
        /*positions_offset*/,null
            /*orbit_status*/,{rotation_deg: 0, orbit_deg: 0}
            /*orbit_radius*/,4
             /*orbit_speed*/,0.6
          /*rotation_speed*/,6
                  /*radius*/,0.6
        /*land_found_color*/,[0.25, 0.25, 0.25, 1]
         /*sea_found_color*/,[0.54, 0, 0.75, 1]
         /*ice_found_color*/,[1, 1, 1, 1]
                 /*heights*/,[]
             /*ice_heights*/,[]
             /*heights_avg*/,0
         /*ice_heights_avg*/,0
                   /*found*/,[]
            /*number_spots*/,6
         /*coords_of_spots*/,[]
             /*found_spots*/,[]
          /*examined_spots*/,[]
     /*total_indexes_found*/,0
       /*total_spots_found*/,0
    /*total_spots_examined*/,0
      /*atten_const_lights*/,1.75
              );

    #planet_prog_skills = 
              new Planet
              (
          /*thing_about_me*/ "programming skills"
                     /*ctm*/,null
        /*positions_offset*/,null
            /*orbit_status*/,{rotation_deg: 0, orbit_deg: 0}
            /*orbit_radius*/,6.5
             /*orbit_speed*/,0.4
          /*rotation_speed*/,3
                  /*radius*/,0.8
        /*land_found_color*/,[0.125, 0.5976, 0.2422, 1]
         /*sea_found_color*/,[0, 0.3672, 0.7187, 1]
         /*ice_found_color*/,[1, 1, 1, 1]
                 /*heights*/,[]
             /*ice_heights*/,[]
             /*heights_avg*/,0
         /*ice_heights_avg*/,0
                   /*found*/,[]
            /*number_spots*/,10
         /*coords_of_spots*/,[]
             /*found_spots*/,[]
          /*examined_spots*/,[]
     /*total_indexes_found*/,0
       /*total_spots_found*/,0
    /*total_spots_examined*/,0
      /*atten_const_lights*/,2
              );

    #planet_uss = 
              new Planet
              (
          /*thing_about_me*/ "experience at United States Steel"
                     /*ctm*/,null
        /*positions_offset*/,null
            /*orbit_status*/,{rotation_deg: 0, orbit_deg: 0}
            /*orbit_radius*/,10
             /*orbit_speed*/,0.2
          /*rotation_speed*/,2
                  /*radius*/,1
        /*land_found_color*/,[0, 0.32, 0.53, 1]
         /*sea_found_color*/,[0.55, 0.5, 0.55, 1]
         /*ice_found_color*/,[1, 1, 1, 1]
                 /*heights*/,[]
             /*ice_heights*/,[]
             /*heights_avg*/,0
         /*ice_heights_avg*/,0
                   /*found*/,[]
            /*number_spots*/,6
         /*coords_of_spots*/,[]
             /*found_spots*/,[]
          /*examined_spots*/,[]
     /*total_indexes_found*/,0
       /*total_spots_found*/,0
    /*total_spots_examined*/,0
      /*atten_const_lights*/,1.75
              );

    #planet_arconic = 
              new Planet
              (
          /*thing_about_me*/ "experience at Arconic"
                     /*ctm*/,null
        /*positions_offset*/,null
            /*orbit_status*/,{rotation_deg: 0, orbit_deg: 0}
            /*orbit_radius*/,15
             /*orbit_speed*/,0.1
          /*rotation_speed*/,1.5
                  /*radius*/,1.2
        /*land_found_color*/,[0, 0.68, 0.72, 1]
         /*sea_found_color*/,[0.5, 0.4, 0.4, 1]
         /*ice_found_color*/,[1, 1, 1, 1]
                 /*heights*/,[]
             /*ice_heights*/,[]
             /*heights_avg*/,0
         /*ice_heights_avg*/,0
                   /*found*/,[]
            /*number_spots*/,4
         /*coords_of_spots*/,[]
             /*found_spots*/,[]
          /*examined_spots*/,[]
     /*total_indexes_found*/,0
       /*total_spots_found*/,0
    /*total_spots_examined*/,0
      /*atten_const_lights*/,1.5
              );

    #planet_pitt = 
              new Planet
              (
          /*thing_about_me*/ "education at the University of Pittsburgh"
                     /*ctm*/,null
        /*positions_offset*/,null
            /*orbit_status*/,{rotation_deg: 0, orbit_deg: 0}
            /*orbit_radius*/,20
             /*orbit_speed*/,0.075
          /*rotation_speed*/,1
                  /*radius*/,0.8
        /*land_found_color*/,[1, 0.72, 0.1, 1]
         /*sea_found_color*/,[0, 0.23, 0.65, 1]
         /*ice_found_color*/,[1, 1, 1, 1]
                 /*heights*/,[]
             /*ice_heights*/,[]
             /*heights_avg*/,0
         /*ice_heights_avg*/,0
                   /*found*/,[]
            /*number_spots*/,2
         /*coords_of_spots*/,[]
             /*found_spots*/,[]
          /*examined_spots*/,[]
     /*total_indexes_found*/,0
       /*total_spots_found*/,0
    /*total_spots_examined*/,0
      /*atten_const_lights*/,1.75
              );

    #planet_languages = 
              new Planet
              (
          /*thing_about_me*/ "spoken languages"
                     /*ctm*/,null
        /*positions_offset*/,null
            /*orbit_status*/,{rotation_deg: 0, orbit_deg: 0}
            /*orbit_radius*/,23
             /*orbit_speed*/,0.04
          /*rotation_speed*/,0.5
                  /*radius*/,0.7
        /*land_found_color*/,[0, 1, 0.5, 1]
         /*sea_found_color*/,[1, 0, 0, 1]
         /*ice_found_color*/,[1, 1, 1, 1]
                 /*heights*/,[]
             /*ice_heights*/,[]
             /*heights_avg*/,0
         /*ice_heights_avg*/,0
                   /*found*/,[]
            /*number_spots*/,2
         /*coords_of_spots*/,[]
             /*found_spots*/,[]
          /*examined_spots*/,[]
     /*total_indexes_found*/,0
       /*total_spots_found*/,0
    /*total_spots_examined*/,0
      /*atten_const_lights*/,1.75
              );

    #planet_pers_projects = 
              new Planet
              (
          /*thing_about_me*/ "personal projects"
                     /*ctm*/,null
        /*positions_offset*/,null
            /*orbit_status*/,{rotation_deg: 0, orbit_deg: 0}
            /*orbit_radius*/,30
             /*orbit_speed*/,0.02
          /*rotation_speed*/,0.6
                  /*radius*/,1.5
        /*land_found_color*/,[1, 0.4, 0, 1]
         /*sea_found_color*/,[0.29, 0.19, 0.09, 1]
         /*ice_found_color*/,[1, 1, 1, 1]
                 /*heights*/,[]
             /*ice_heights*/,[]
             /*heights_avg*/,0
         /*ice_heights_avg*/,0
                   /*found*/,[]
            /*number_spots*/,3
         /*coords_of_spots*/,[]
             /*found_spots*/,[]
          /*examined_spots*/,[]
     /*total_indexes_found*/,0
       /*total_spots_found*/,0
    /*total_spots_examined*/,0
      /*atten_const_lights*/,1.25
              );

    #planets_list = 
         [
              this.#planet_prof_skills
             ,this.#planet_prog_skills
             ,this.#planet_uss
             ,this.#planet_arconic
             ,this.#planet_pitt
             ,this.#planet_languages
             ,this.#planet_pers_projects
         ];

    #land_not_found_color =  [1, 0.9490, 0.7490, 1];
    #sea_not_found_color =  [1, 0.9922, 0.9569, 1];
    #ice_not_found_color =  [1, 0.9725, 0.8667, 1];
    #total_amount_longitudes = 90;
    #total_amount_latitudes = 45;
    #spaceship = new Spaceship(1/10);

    getStar() { return this.#star; }

    getPlanet(index) { return this.#planets_list[index]; }

    getNumberPlanets() { return this.#planets_list.length; }

    getLandNotFoundColor() { return this.#land_not_found_color; }

    getSeaNotFoundColor() { return this.#sea_not_found_color; }

    getIceNotFoundColor() { return this.#ice_not_found_color; }

    getTotalAmtLongitudes() { return this.#total_amount_longitudes; }

    getTotalAmtLatitudes() { return this.#total_amount_latitudes; }

    getSpaceship() { return this.#spaceship; }
}