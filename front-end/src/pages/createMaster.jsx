import React,{useContext,useEffect} from 'react';
import './CreateMaster.css';
import {AnimatePresence, motion} from 'framer-motion';
import {Navbar} from '../components/common';
const CreateMaster = () =>{

    const  pageVariants = {
        in: {
          opacity: 1,
          x: 0
        },
        out:{
          opacity: 1,
          x: "-100vw"
        }
      };
    
    const pageTransition = {
        type: "spring"
        
    }
    return(
        <div className="createMaster">
            <Navbar/>
            <motion.div  initial="out" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <h1>Diri ka mag sugod ezers</h1>
            </motion.div>
        </div>
    )
}
export default CreateMaster;