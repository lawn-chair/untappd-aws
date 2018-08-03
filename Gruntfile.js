module.exports = function (grunt) {

    grunt.initConfig({
        lambda_package: {
            default: {
                options: {
                    exlude_aws_sdk: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-aws-lambda-package');
    grunt.registerTask('package', ['lambda_package']);
};

