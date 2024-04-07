import { ProductRepository } from "../services/index.js";
import Mail from "../modules/mail.module.js";

//-------------------------------------------------------------------

export const getProducts = async (req, res) => {

    try {
        const limit = parseInt(req.query.limit);

        const productList = await ProductRepository.getProducts();

        if (!limit || !limit == Number) {
            return res.send({ products: productList });
        }

        const limitProducts = productList.slice(0, limit);

        return res.send({ products: limitProducts });

    } catch (error) {
        res.status(500).send({ status: 'error', result: error })
    }
}

//-------------------------------------------------------------------

export const productId = async (req, res) => {

    try {
        const productId = req.params.pid;

        const product = await ProductRepository.getProductById(productId);

        if (!product) {
            req.logger.error("Product not founded")
            return res.status(400).send({ error: "Product not founded" });
        }

        if (product) {
            req.logger.info("Product founded")
            return res.send({ product: product });
        }
    }
    catch (error) {

        return error
    }

}

//-------------------------------------------------------------------

export const createProduct = async (req, res) => {

    try {

        if (req.files) {
            req.body.thumbnails = [];
            req.files.forEach((file) => req.body.thumbnails.push(file.filename));
        }

        const Listproducts = await ProductRepository.getProducts();

        const productRepeat = Listproducts.some(prod => prod.code === req.body.code);

        const checkOne = Object.keys(req.body).length;
        const checTwo = Object.values(req.body).includes("");

        if (productRepeat) {
            req.logger.warning("the product already exists")
            return res.status(400).send({ status: "Este producto ya existe, por favor verifique" });
        }

        if (checkOne < 6 || checTwo) {
            req.logger.warning("The product is not complete")
            return res.status(400).send({ status: "Valores imcompletos, por favor verifique" });
        }

        const creator = req.user

        const finalProduct = req.body

        if (creator.user.role !== 'admin') {
            finalProduct.owner = creator.user.email
        }

        const newProduct = await ProductRepository.addProduct(req.body);

        res.send({ status: "Producto Crado correctamente", result: req.body });

    } catch (error) {
        res.status(400).send({ status: error, result: "No se pudo crear el producto" })
    }
}

//-------------------------------------------------------------------

export const updateProduct = async (req, res) => {

    try {
        if (req.files) {
            req.body.thumbnails = [];
            req.files.forEach((file) => req.body.thumbnails.push(file.filename));
        }

        const productUpdated = await ProductRepository.updateProduct(req.params.pid, req.body)

        res.send({ status: "Producto actualizado", result: req.body });

    } catch (error) {
        req.logger.error("Error to update product")
        res.status(400).send({ status: error, message: "No se pudo actualizar el producto" });
    }

}

//-------------------------------------------------------------------

export const deletProduct = async (req, res) => {

    try {

        const creator = req.user;
        const productID = req.params.pid

        const product = await ProductRepository.getProductById(productID);

        if (!product) {
            req.logger.error("Error to delet product")
            res.status(400).send({ status: "Error to delet product" })
        }

        if (creator.user.role === 'admin' || product.owner == creator.user.email) {

            const deletProduct = await ProductRepository.deletProduct(productID);

            if(product.owner != creator.user.email){
                const mailModule= new Mail();
                const html = `<h2>Un producto que has creado, fue eliminado por un Admin </h2>`
                await mailModule.send(product.owner, "Un producto tuyo fue eliminado de la base de datos", html);
            }

            if (deletProduct) return res.send({ status: 'Product deleted', payload: deletProduct })

        }

        if(product.owner != creator.user.email || creator.user.role != 'admin'){
            req.logger.error("Not autorized for delet this product")
            res.status(400).send({ status: "Not autorized for delet this product" })
        }

    } catch (error) {
        return error
    }

}