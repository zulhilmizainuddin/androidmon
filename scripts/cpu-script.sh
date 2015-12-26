filename=/sdcard/androidmon.conf;
echo 0 > $filename;
while true;
    do flag=$(cat $filename);
        if [ $flag -eq 1 ];
            then break;
        fi;
        result=$(top -d 1 -n 1 | grep -e %s$);
        if [ $? -eq 0 ];
            then if [ -n "$result" ];
                then array=($result);
                echo "ok ${array[2]} ${array[0]} ${array[4]}";
            else echo "ok 0 0 0";
            fi;
        else echo "ok 0 0 0";
        fi;
    done