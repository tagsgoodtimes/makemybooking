import express from 'express';
import { createHotel, updateHotel, deleteHotel, getHotel, getHotels, countByCity, countByType, getHotelRooms } from '../controllers/hotel.js';
import Hotel from '../models/Hotel.js'
import {createError} from '../utils/error.js'
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// Create
router.post('/', verifyAdmin, createHotel)

// Update
router.put('/:id', verifyAdmin, updateHotel)

// Delete
router.delete("/find/:id", verifyAdmin, deleteHotel)

// Get
router.get('/find/:id', getHotel)

// Get All
router.get('/', getHotels)
router.get('/countByCity', countByCity)
router.get('/countByType', countByType)
router.get('/rooms/:id', getHotelRooms)


// router.get('/', async(req, res, next)=>{

//     console.log('im a hotel route')

//     // const failed = true
//     // const err = new Error()
//     // err.status = 404
//     // err.message = 'Sorry not found!'
//     // if(failed) return next(err)

    
//     try{
//         const hotels = await Hotel.find()
//         res.status(200).json(hotels);
//     }
//     catch(error){
//         // res.status(500).json(error);
//         next(error)
//     }
// })

export default router