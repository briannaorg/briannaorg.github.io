module.exports = function( grunt ) {
	'use strict';

	// Load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Project configuration
	grunt.initConfig( {
		pkg:    grunt.file.readJSON( 'package.json' ),
		
		sprite: {
			all: {
				'src': 'images/sprites/*.png',
				'dest': 'images/sprites.png',
				'destCss': 'sass/base/_sprites.scss',
				'imgPath': 'images/sprites.png',
				'algorithm': 'binary-tree',
			}
		},

		svgmin: {
			options: {
				plugins: [ // https://github.com/svg/svgo/tree/master/plugins
					{ removeComments: true },
					{ removeTitle: true },
					{ removeUselessStrokeAndFill: true },
					{ removeEmptyAttrs: true }
				]
			},
			dist: {
				files: [{
					expand: true,
					cwd: '',
					src: ['images/svg/*.svg'],
					dest: ''
				}]
			}
		},

		svgstore: {
			options: {
				prefix: 'icon-',
				cleanup: ['fill', 'style'],
				svg: {
					style: 'display: none;'
				}
			},
			default: {
				files: {
					'images/svg-defs.svg': 'images/svg/*.svg',
				}
			}
		},

		sass: {
			options: {
				sourceMap: true,
				outputStyle: 'expanded',
				lineNumbers: true,
				includePaths: [
					'bower_components/bourbon/app/assets/stylesheets',
					'bower_components/neat/app/assets/stylesheets'
				]
			},
			dist: {
				files: {
					'style.css': 'sass/style.scss'
				}
			}
		},

		autoprefixer: {
			options: {
				browsers: ['last 2 versions', 'ie 9'],
				map: {
					inline: false,
					sourcesContent: false
				}
			},
			dist: {
				src: ['style.css']
			}
		},

		cssmin: {
			minify: {
				expand: true,
				src: ['style.css'],
				ext: '.css'
			}
		},
		cssjanus: {
			dev: {
				options: {
					swapLtrRtlInUrl: false
				},
				src: ['style.css'],
				dest: 'rtl.css'
			}
		},
		concat: {
			dist: {
				src: ['js/concat/*.js'],
				dest: 'js/project.js',
			}
		},		
		uglify: {
			build: {
				options: {
					mangle: false
				},
				files: [{
					expand: true,
					cwd: 'js/',
					src: ['**/*.js', '!**/*.min.js', '!concat/*.js'],
					dest: 'js/',
					ext: '.min.js'
				}]
			}
		},
		watch:  {
			scripts: {
				files: ['js/**/*.js'],
				tasks: ['javascript'],
				options: {
					spawn: false,
					livereload: true,
				},
			},

			css: {
				files: ['sass/**/*.scss'],
				tasks: ['sass'],
				options: {
					spawn: false,
					livereload: true,
				},
			},

			sprite: {
				files: ['images/sprites/*.png'],
				tasks: ['sprite', 'styles'],
				options: {
					spawn: false,
					livereload: true,
				},
			},

			svg: {
				files: ['images/svg/*.svg'],
				tasks: ['svgstore'],
				options: {
					spawn: false,
					livereload: true,
				},
			},
		},
		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'images/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'images/'
				}]
			}
		}
	});
	
	grunt.registerTask('styles', ['sass', 'autoprefixer', 'cmq', 'csscomb', 'cssmin']);
	grunt.registerTask('javascript', ['concat', 'uglify']);
	grunt.registerTask('imageminnewer', ['newer:imagemin']);
	grunt.registerTask('sprites', ['sprite']);
	grunt.registerTask('icons', ['svgmin', 'svgstore']);
	grunt.registerTask('i18n', ['makepot']);
	grunt.registerTask('default', ['styles', 'javascript', 'imageminnewer', 'icons', 'i18n']);

	grunt.util.linefeed = '\n';
};