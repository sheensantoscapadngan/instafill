import React,{useContext,useEffect} from 'react';
import './CreateMaster.css';
import {AnimatePresence, motion} from 'framer-motion';
import {Navbar} from '../components/common';
const CreateMaster = () =>{
    return(
        <div className="createMaster">
            <Navbar/>
            <motion.div  initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity:0}}>
                <h1>Diri ka mag sugod ezers</h1>
            </motion.div>
        </div>
    )
}
export default CreateMaster;
