const Joi = require("joi")

module.exports = (req,res,next) => {
    const { nickname, password } = req.body

    const joiSchema = Joi.object({
        nickname: Joi.string().min(3).max(30).alphanum().required()
        .messages({
            'string.empty': '닉네임은 필수 항목입니다.',
            'any.required': '닉네임은 필수 항목입니다.',
            'string.min': '닉네임은 3자 이상이야 합니다.',
            'string.max': '닉네임은 30자 이하이야 합니다.',
            'string.alphanum': '닉네임은 영어 대소문자와 숫자로만 이루워질 수 있습니다.'
        }),
        password: Joi.string().min(4).required()
        .messages({
            'string.empty': '패스워드은 필수 항목입니다.',
            'any.required': '패스워드은 필수 항목입니다.',
            'string.min': '패스워드는 4자 이상이야 합니다.'
        }),
        confirmPassword: Joi.string().required()
        .messages({
            'string.empty': '패스워드를 다시 입력해주세요.',
            'any.required': '패스워드를 다시 입력해주세요.'
        })
    })

    const result = joiSchema.validate({nickname, password})
    
    if(result.error){
        const message  = result.error.details[0].message
        res.status(400).send({errorMessage:message})
        return
    }
    next()
}