'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
    signatureVersion: 'v4',
});
const Sharp = require('sharp');

const BUCKET = process.env.BUCKET;
const URL = process.env.URL;
const ALLOWED_SIZES = process.env.ALLOWED_SIZES;

exports.handler = async (event, context, callback) => {
    const key = event.queryStringParameters.key;
    const match = key.match(/(.*)_(\d+)x(\d+)\.(.*)/);
    const width = parseInt(match[2], 10);
    const height = parseInt(match[3], 10);
    const originalKey = match[1] + '.' + match[4];
    const allowedSizes = ALLOWED_SIZES.replace(/\s+/g, "").split(',');

    let deny = false;
    if (ALLOWED_SIZES && allowedSizes.length > 0) {
        deny = true;
        for (let i = 0; i < allowedSizes.length; i++) {
            if (!!~allowedSizes[i].indexOf(width + 'x' + height)) {
                deny = false;
                break;
            }
        }
    }

    if (deny) {
        callback("not allowed size");
    } else {
        let contentType = 'image/png';
        if (match[4] == 'jpeg' || match[4] == 'jpg') {
            contentType = 'image/jpeg';
        }

        try {
            const s3Data = await S3.getObject({
                Bucket: BUCKET,
                Key: originalKey
            }).promise()

            const buffer = await Sharp(s3Data.Body).resize(width, height, { fit: 'inside' }).toBuffer()

            await S3.putObject({
                Body: buffer,
                Bucket: BUCKET,
                ContentType: contentType,
                CacheControl: 'max-age=86400',
                Key: key,
            }).promise()

            callback(null, {
                statusCode: '301',
                headers: { 'location': `${URL}/${key}` },
                body: '',
            })
        } catch (err) {
            callback(err)
        }
    }
}'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
    signatureVersion: 'v4',
});
const Sharp = require('sharp');

const BUCKET = process.env.BUCKET;
const URL = process.env.URL;
const ALLOWED_SIZES = process.env.ALLOWED_SIZES;

exports.handler = async (event, context, callback) => {
    const key = event.queryStringParameters.key;
    const match = key.match(/(.*)_(\d+)x(\d+)\.(.*)/);
    const width = parseInt(match[2], 10);
    const height = parseInt(match[3], 10);
    const originalKey = match[1] + '.' + match[4];
    const allowedSizes = ALLOWED_SIZES.replace(/\s+/g, "").split(',');

    let deny = false;
    if (ALLOWED_SIZES && allowedSizes.length > 0) {
        deny = true;
        for (let i = 0; i < allowedSizes.length; i++) {
            if (!!~allowedSizes[i].indexOf(width + 'x' + height)) {
                deny = false;
                break;
            }
        }
    }

    if (deny) {
        callback("not allowed size");
    } else {
        let contentType = 'image/png';
        if (match[4] == 'jpeg' || match[4] == 'jpg') {
            contentType = 'image/jpeg';
        }

        try {
            const s3Data = await S3.getObject({
                Bucket: BUCKET,
                Key: originalKey
            }).promise()

            const buffer = await Sharp(s3Data.Body).resize(width, height, { fit: 'inside' }).toBuffer()

            await S3.putObject({
                Body: buffer,
                Bucket: BUCKET,
                ContentType: contentType,
                CacheControl: 'max-age=86400',
                Key: key,
            }).promise()

            callback(null, {
                statusCode: '301',
                headers: { 'location': `${URL}/${key}` },
                body: '',
            })
        } catch (err) {
            callback(err)
        }
    }
}