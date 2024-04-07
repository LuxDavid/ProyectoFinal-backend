export const tryLoggers= async (req,res)=>{

req.logger.debug('this is DEBUG')
req.logger.info('This is INFO')
req.logger.warning('this is WARNING')
req.logger.error('this is ERROR ')
req.logger.fatal('this is FATAL ')

res.send('Todo ok')

}