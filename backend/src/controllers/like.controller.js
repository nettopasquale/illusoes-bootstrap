import LikeModel from "../models/like.model.js";

//fazer o like
export const toogleLike = async(req, res)=>{
    try{
        const{targetId, targetTipo} = req.body;
        const usuarioId = req.userId;

        const like = await LikeModel.findOne({
            usuario: usuarioId,
            targetId,
            targetTipo,
        });

        if(like){
            await like.deleteOne();
            const total = await LikeModel.countDocuments({targetId, targetTipo});

            return res.json({curtiu: false, curtidasTotais: total});
        }

        await LikeModel.create({
            usuario: usuarioId,
            targetId,
            targetTipo,
        });
        const total = await LikeModel.countDocuments({targetId, targetTipo});

        res.json({curtiu: true, curtidasTotais: total});
    }catch(error){
        res.status(500).json({error: error.message})
    }
}

//buscar likes
export const buscarLikes = async (req, res) => {
    try{
        const {targetId, targetTipo} = req.params;
        
        const total = await LikeModel.countDocuments({
            targetId,
            targetTipo
        });
    
        res.status(201).json({curtidasTotais: total});

    }catch(error){
        console.error("Erro ao buscar likes: ", error)
        res.status(500).json({ error: error.message });
    }
};