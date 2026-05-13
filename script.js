
        // Плавная прокрутка к разделам
        document.querySelectorAll('.nav-btn').forEach(button => {
            button.addEventListener('click', function() {
                const sectionId = this.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                
                // Удаляем активный класс у всех кнопок
                document.querySelectorAll('.nav-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Добавляем активный класс к текущей кнопке
                this.classList.add('active');
                
                // Прокручиваем к выбранному разделу
                window.scrollTo({
                    top: section.offsetTop - 100,
                    behavior: 'smooth'
                });
            });
        });
        
        // Изменение активной кнопки при прокрутке
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('section');
            const navButtons = document.querySelectorAll('.nav-btn');
            
            let currentSection = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                    currentSection = section.id;
                }
            });
            
            navButtons.forEach(button => {
                button.classList.remove('active');
                if (button.getAttribute('data-section') === currentSection) {
                    button.classList.add('active');
                }
            });
        });
        
        // Реализация аудиоплеера
        document.addEventListener('DOMContentLoaded', function() {
            // Инициализация всех аудиоплееров
            initializeAudioPlayers();
        });
        
        function initializeAudioPlayers() {
            const playPauseButtons = document.querySelectorAll('.play-pause-btn');
            
            playPauseButtons.forEach(button => {
                const audioId = button.getAttribute('data-audio');
                const audio = document.getElementById(audioId);
                const progressBar = button.closest('.audio-player').querySelector('.progress');
                const progressContainer = button.closest('.audio-player').querySelector('.progress-bar');
                const timeDisplay = button.closest('.audio-player').querySelector('.time-display');
                const volumeSlider = button.closest('.audio-player').querySelector('.volume-slider');
                const playIcon = button.querySelector('i');
                
                // Установка начальной громкости
                audio.volume = volumeSlider.value / 100;
                
                // Обновление прогресса воспроизведения
                audio.addEventListener('timeupdate', function() {
                    const currentTime = audio.currentTime;
                    const duration = audio.duration;
                    
                    // Обновление прогресс-бара
                    if (duration) {
                        const progressPercent = (currentTime / duration) * 100;
                        progressBar.style.width = `${progressPercent}%`;
                    }
                    
                    // Обновление отображения времени
                    timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
                });
                
                // Переключение воспроизведения/паузы
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // Остановить все другие аудио
                    stopAllAudioExcept(audioId);
                    
                    if (audio.paused) {
                        audio.play();
                        playIcon.classList.remove('fa-play');
                        playIcon.classList.add('fa-pause');
                    } else {
                        audio.pause();
                        playIcon.classList.remove('fa-pause');
                        playIcon.classList.add('fa-play');
                    }
                });
                
                // Перемотка при клике на прогресс-бар
                progressContainer.addEventListener('click', function(e) {
                    const clickPosition = e.offsetX;
                    const width = this.clientWidth;
                    const duration = audio.duration;
                    
                    if (duration) {
                        audio.currentTime = (clickPosition / width) * duration;
                    }
                });
                
                // Регулировка громкости
                volumeSlider.addEventListener('input', function() {
                    audio.volume = this.value / 100;
                    
                    // Обновление иконки громкости
                    const volumeIcon = this.closest('.volume-control').querySelector('.volume-icon');
                    if (this.value == 0) {
                        volumeIcon.classList.remove('fa-volume-up', 'fa-volume-down');
                        volumeIcon.classList.add('fa-volume-mute');
                    } else if (this.value < 50) {
                        volumeIcon.classList.remove('fa-volume-up', 'fa-volume-mute');
                        volumeIcon.classList.add('fa-volume-down');
                    } else {
                        volumeIcon.classList.remove('fa-volume-down', 'fa-volume-mute');
                        volumeIcon.classList.add('fa-volume-up');
                    }
                });
                
                // Сброс кнопки при окончании трека
                audio.addEventListener('ended', function() {
                    playIcon.classList.remove('fa-pause');
                    playIcon.classList.add('fa-play');
                    progressBar.style.width = '0%';
                    timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
                });
                
                // Установка времени при загрузке
                audio.addEventListener('loadedmetadata', function() {
                    timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
                });
            });
        }
        
        // Функция для остановки всех аудио, кроме указанного
        function stopAllAudioExcept(currentAudioId) {
            const allAudios = document.querySelectorAll('audio');
            const allPlayButtons = document.querySelectorAll('.play-pause-btn');
            
            allAudios.forEach(audio => {
                if (audio.id !== currentAudioId) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
            
            allPlayButtons.forEach(button => {
                const audioId = button.getAttribute('data-audio');
                if (audioId !== currentAudioId) {
                    const icon = button.querySelector('i');
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                    
                    // Сброс прогресс-бара
                    const progressBar = button.closest('.audio-player').querySelector('.progress');
                    if (progressBar) {
                        progressBar.style.width = '0%';
                    }
                }
            });
        }
        
        // Форматирование времени (секунды в мм:сс)
        function formatTime(seconds) {
            if (isNaN(seconds) || seconds === Infinity) return '0:00';
            
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        }
        
        // Эффект при загрузке страницы
        window.addEventListener('load', function() {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
            
            // Автоматически загружаем метаданные первого трека для отображения времени
            const firstAudio = document.getElementById('track1');
            if (firstAudio) {
                firstAudio.load();
            }
        });
                (function() {
            const slider = document.getElementById('videoSlider');
            const scrollLeftBtn = document.getElementById('scrollLeft');
            const scrollRightBtn = document.getElementById('scrollRight');

            // Плавная прокрутка по клику на кнопки
            const scrollAmount = 400; // примерная ширина карточки + gap

            scrollLeftBtn.addEventListener('click', () => {
                slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });

            scrollRightBtn.addEventListener('click', () => {
                slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });

            // Дополнительно: автоматическая остановка видео при скролле (опционально)
            // Находим все видео, чтобы при скролле не играли одновременно (если нужно)
            const allVideos = document.querySelectorAll('.video-wrapper video');
            
            // Функция для остановки всех видео кроме текущего (можно не использовать, но добавим для удобства)
            function pauseOtherVideos(exceptVideo) {
                allVideos.forEach(video => {
                    if (video !== exceptVideo && !video.paused) {
                        video.pause();
                    }
                });
            }

            // При воспроизведении видео останавливаем другие
            allVideos.forEach(video => {
                video.addEventListener('play', function() {
                    pauseOtherVideos(this);
                });
            });

            // Небольшая хитрость: останавливать видео, если оно ушло из видимости (по желанию)
            // Используем Intersection Observer, но для простоты пока так.

            // Можно добавить наблюдение за видимостью, чтобы останавливать видео, которое не видно
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const video = entry.target.querySelector('video');
                        if (video) {
                            // Если видео не видно и оно играет — ставим на паузу
                            if (!entry.isIntersecting && !video.paused) {
                                video.pause();
                            }
                        }
                    });
                }, { threshold: 0.3 }); // когда 30% видно

                document.querySelectorAll('.video-card').forEach(card => {
                    observer.observe(card);
                });
            }
        })();
    