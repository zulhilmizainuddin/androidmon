var shell = {
    scripts: {
        cpuScript:  'filename=/data/data/apm.conf;' +
                    'echo 0 > $filename;' +
                    'if [ $? -eq 1 ];' +
                        'then filename=/sdcard/apm.conf;' +
                        'echo 0 > $filename;' +
                    'fi;' +
                    'while true;' +
                        'do flag=$(cat $filename);' +
                            'if [ $flag -eq 1 ];' +
                                'then break;' +
                            'fi;' +
                            'result=$(top -d 1 -n 1 | grep -e %s$);' +
                            'if [ $? -eq 0 ];' +
                                'then if [ -n "$result" ];' +
                                        'then array=($result);' +
                                        'echo "ok ${array[2]} ${array[0]} ${array[4]}";' +
                                    'else echo "ok 0 0 0";' +
                                    'fi;' +
                            'else echo "ok 0 0 0";' +
                            'fi;' +
                        'done',

        memoryScript:   'filename=/data/data/apm.conf;' +
                        'echo 0 > $filename;' +
                        'if [ $? -eq 1 ];' +
                            'then filename=/sdcard/apm.conf;' +
                            'echo 0 > $filename;' +
                        'fi;' +
                        'while true;' +
                            'do flag=$(cat $filename);' +
                                'if [ $flag -eq 1 ];' +
                                    'then break;' +
                                'fi;' +
                                'result=$(dumpsys meminfo %s | grep TOTAL);' +
                                'if [ $? -eq 0 ];' +
                                    'then if [ -n "$result" ];' +
                                            'then array=($result);' +
                                            'echo "ok ${array[1]} ${array[2]} ${array[3]}";' +
                                        'else echo "ok 0 0 0";' +
                                        'fi;' +
                                'else echo "ok 0 0 0";' +
                                'fi;' +
                                'sleep 1;' +
                            'done',

        killScript: 'adb shell ' +
                    '"' +
                    'filename=/data/data/apm.conf;' +
                    'echo 1 > $filename;' +
                    'if [ $? -eq 1 ];' +
                        'then filename=/sdcard/apm.conf;' +
                        'echo 1 > $filename;' +
                    'fi;' +
                    '"',

        startAdb: 'adb shell "echo start > /dev/null"'
    }
};

module.exports = shell;
